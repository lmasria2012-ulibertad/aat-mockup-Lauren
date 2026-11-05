// Prueba local sin mandar correos reales: node scripts/probar-recordatorios.js
const assert = require('assert');
const {
  mananaEnCDMX, seleccionarRecordatorios, enviarConResend,
} = require('../api/recordatorios');

(async () => {
  // 1) "Mañana" en CDMX. 2026-11-06 03:00 UTC = 2026-11-05 21:00 en CDMX => mañana = 11-06.
  assert.strictEqual(mananaEnCDMX(new Date('2026-11-06T03:00:00Z')), '2026-11-06');
  assert.strictEqual(mananaEnCDMX(new Date('2026-12-31T16:00:00Z')), '2027-01-01');

  const autos = [
    { id: 'A1', direccion: 'Insurgentes 1234', telefono: '+52 55 1111 1111' },
    { id: 'A2', direccion: 'Durango 45', telefono: '+52 55 2222 2222' },
  ];
  const reservas = [
    { fecha_inicio: '2026-11-06', hora_entrega: '09:30', email: 'manana@x.com', auto_id: 'A1', estado: 'confirmada' },
    { fecha_inicio: '2026-11-06', hora_entrega: '18:00', email: 'cancelada@x.com', auto_id: 'A2', estado: 'cancelada' },
    { fecha_inicio: '2026-11-08', hora_entrega: '11:00', email: 'en3dias@x.com', auto_id: 'A2', estado: 'confirmada' },
  ];

  // 2) Solo la reserva de mañana, no cancelada, con datos correctos.
  const { envios, omitidos } = seleccionarRecordatorios(reservas, autos, '2026-11-06');
  assert.strictEqual(envios.length, 1);
  assert.deepStrictEqual(
    { para: envios[0].para, hora: envios[0].hora, direccion: envios[0].direccion, telefono: envios[0].telefono },
    { para: 'manana@x.com', hora: '09:30', direccion: 'Insurgentes 1234', telefono: '+52 55 1111 1111' },
  );
  assert.deepStrictEqual(omitidos.map((o) => o.motivo), ['cancelada']);

  // 3) Correr dos veces da la misma llave de idempotencia (Resend no duplica).
  const segunda = seleccionarRecordatorios(reservas, autos, '2026-11-06');
  assert.strictEqual(segunda.envios[0].idempotencia, envios[0].idempotencia);

  // 4) El envío lleva la clave del entorno y la llave de idempotencia; el cuerpo trae los datos.
  process.env.RESEND_API_KEY = 're_prueba';
  let llamada;
  const fetchFalso = async (url, opts) => {
    llamada = { url, opts };
    return { ok: true, json: async () => ({ id: 'email_123' }) };
  };
  const id = await enviarConResend(envios[0], fetchFalso);
  assert.strictEqual(id, 'email_123');
  assert.strictEqual(llamada.url, 'https://api.resend.com/emails');
  assert.strictEqual(llamada.opts.headers.Authorization, 'Bearer re_prueba');
  assert.strictEqual(llamada.opts.headers['Idempotency-Key'], envios[0].idempotencia);
  const cuerpo = JSON.parse(llamada.opts.body);
  assert.deepStrictEqual(cuerpo.to, ['manana@x.com']);
  for (const dato of ['09:30', 'Insurgentes 1234', '+52 55 1111 1111']) {
    assert.ok(cuerpo.text.includes(dato) && cuerpo.html.includes(dato), `falta ${dato}`);
  }

  // 5) Auto inexistente => no se manda (no se inventan datos).
  const sinAuto = seleccionarRecordatorios(
    [{ fecha_inicio: '2026-11-06', hora_entrega: '10:00', email: 'z@x.com', auto_id: 'NOPE', estado: 'confirmada' }],
    autos, '2026-11-06',
  );
  assert.strictEqual(sinAuto.envios.length, 0);

  console.log('OK: todas las pruebas pasaron');
})().catch((e) => { console.error(e); process.exit(1); });
