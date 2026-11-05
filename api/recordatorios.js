// Recordatorio de entrega: un día antes de cada renta, manda al arrendatario
// un correo con hora de entrega, dirección de recogida y teléfono del dueño.
// Lo dispara el cron diario de Vercel (ver vercel.json).
//
// Variables de entorno (solo en Vercel, nunca en archivos):
//   RESEND_API_KEY  clave de Resend
//   CRON_SECRET     Vercel la manda como "Authorization: Bearer <CRON_SECRET>" en cada cron

const reservas = require('./_data/reservas.json');
const autos = require('./_data/autos.json');

const ZONA = 'America/Mexico_City';
const REMITENTE = 'RentaGo <onboarding@resend.dev>';

// Fecha de "mañana" (YYYY-MM-DD) en la zona de CDMX, sin depender de la zona del servidor.
function mananaEnCDMX(ahora = new Date()) {
  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(ahora); // "2026-11-05"
  const [a, m, d] = hoy.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d + 1)).toISOString().slice(0, 10);
}

// Decide a quién se le manda correo. Pura: no envía nada.
function seleccionarRecordatorios(listaReservas, listaAutos, manana) {
  const autosPorId = new Map(listaAutos.map((a) => [String(a.id), a]));
  const envios = [];
  const omitidos = [];

  for (const r of listaReservas) {
    if (r.fecha_inicio !== manana) continue;
    if (r.estado === 'cancelada') {
      omitidos.push({ email: r.email, auto_id: r.auto_id, motivo: 'cancelada' });
      continue;
    }
    const auto = autosPorId.get(String(r.auto_id));
    const faltan = [];
    if (!r.email) faltan.push('email');
    if (!r.hora_entrega) faltan.push('hora_entrega');
    if (!auto) faltan.push('auto');
    else {
      if (!auto.direccion) faltan.push('direccion');
      if (!auto.telefono) faltan.push('telefono');
    }
    if (faltan.length) {
      omitidos.push({ email: r.email, auto_id: r.auto_id, motivo: `faltan datos: ${faltan.join(', ')}` });
      continue;
    }
    envios.push({
      para: r.email,
      fecha: r.fecha_inicio,
      hora: r.hora_entrega,
      direccion: auto.direccion,
      telefono: auto.telefono,
      // Misma reserva => misma llave => Resend no la manda dos veces.
      idempotencia: `recordatorio-${r.auto_id}-${r.fecha_inicio}-${r.email}`,
    });
  }
  return { envios, omitidos };
}

function escapar(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function armarCorreo(e) {
  const asunto = `Tu renta RentaGo empieza mañana (${e.fecha})`;
  const texto = [
    'Hola,',
    '',
    `Tu renta empieza mañana, ${e.fecha}. Estos son los datos para recoger el auto:`,
    '',
    `Hora de entrega: ${e.hora}`,
    `Dirección de recogida: ${e.direccion}`,
    `Teléfono del dueño: ${e.telefono}`,
    '',
    'Si vas a llegar tarde, avísale al dueño por teléfono.',
    '',
    '— RentaGo',
  ].join('\n');
  const html = `
    <p>Hola,</p>
    <p>Tu renta empieza mañana, <strong>${escapar(e.fecha)}</strong>. Estos son los datos para recoger el auto:</p>
    <ul>
      <li><strong>Hora de entrega:</strong> ${escapar(e.hora)}</li>
      <li><strong>Dirección de recogida:</strong> ${escapar(e.direccion)}</li>
      <li><strong>Teléfono del dueño:</strong> ${escapar(e.telefono)}</li>
    </ul>
    <p>Si vas a llegar tarde, avísale al dueño por teléfono.</p>
    <p>— RentaGo</p>`;
  return { from: REMITENTE, to: [e.para], subject: asunto, text: texto, html };
}

async function enviarConResend(e, fetchFn = fetch) {
  const res = await fetchFn('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': e.idempotencia,
    },
    body: JSON.stringify(armarCorreo(e)),
  });
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${cuerpo.message || JSON.stringify(cuerpo)}`);
  return cuerpo.id;
}

async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.authorization !== `Bearer ${secreto}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const manana = mananaEnCDMX();
  const { envios, omitidos } = seleccionarRecordatorios(reservas, autos, manana);
  const dry = req.query && (req.query.dry === '1' || req.query.dry === 'true');

  if (dry) {
    return res.status(200).json({ manana, dry: true, se_enviarian: envios, omitidos });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Falta RESEND_API_KEY' });
  }

  const enviados = [];
  const errores = [];
  for (const e of envios) {
    try {
      enviados.push({ para: e.para, id: await enviarConResend(e) });
    } catch (err) {
      errores.push({ para: e.para, error: err.message });
    }
  }
  console.log(JSON.stringify({ manana, enviados, omitidos, errores }));
  return res.status(errores.length ? 500 : 200).json({ manana, enviados, omitidos, errores });
}

module.exports = handler;
module.exports.mananaEnCDMX = mananaEnCDMX;
module.exports.seleccionarRecordatorios = seleccionarRecordatorios;
module.exports.armarCorreo = armarCorreo;
module.exports.enviarConResend = enviarConResend;
