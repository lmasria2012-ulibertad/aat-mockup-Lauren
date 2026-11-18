# RentaGo

RentaGo es una plataforma de renta de autos entre personas: conecta a viajeros con dueños de autos.

**App publicada:** https://aat-mockup-lauren.vercel.app/

## Funciones

- **Cotizador de renta:** calcula días, subtotal, seguro, comisión y total en USD.
- **Cuentas de usuario:** registro, inicio de sesión y cierre de sesión con Supabase Auth.
- **Publicación de autos:** los dueños con sesión publican su auto con foto y zona aproximada.
- **Catálogo de autos:** cualquier visitante puede ver los autos publicados y cotizarlos.
- **Autos cerca de mí:** con permiso de ubicación, muestra en un mapa los autos cercanos y los ordena por distancia.
- **Formulario de contacto:** guarda los mensajes en Supabase.

## Herramientas

- HTML, CSS y JavaScript
- Vercel (hosting)
- Supabase (cuentas, base de datos y fotos)
- Leaflet y OpenStreetMap (mapa)
- GitHub Actions (tarea que mantiene activo el proyecto de Supabase)

## Decisiones de diseño vs. sugerencias del IS

### Decisión 1: pausa de Supabase (escalabilidad)

- **Qué propuso el IS:** ante la pausa del plan Free tras 1 semana de inactividad, me dio 3 opciones: pagar Supabase Pro ($25 USD al mes), programar una tarea automática o reactivar el proyecto a mano.
- **Qué decidí:** aceptar la tarea automática y rechazar las otras dos.
- **Por qué:** siento que no era tema de pagar, sino de resolver el problema de otra manera. Tampoco quise hacerlo a mano porque no es práctico y tomaría tiempo innecesario. Preferí esta opción porque para RentaGo lo más importante es que los clientes estén satisfechos y tengan una buena experiencia, para que regresen y se cree lealtad; si la app está pausada, no pueden hacer el servicio que desean.
- **Cómo lo verifiqué:** corrí la tarea a mano con **Run workflow** en la pestaña Actions de GitHub y terminó con palomita verde en 11 segundos, lo que confirmó que sí se conecta a mi base de datos. También revisé en Supabase que el proyecto volviera a aparecer como *Healthy*. La tarea quedó programada para repetirse cada 3 días.

### Decisión 2: precios del cotizador (funcionalidad)

- **Qué propuso el IS:** subir los precios a Ciudad $45, Playa $65 y Off-Road $95 USD por día, con seguro de $15.
- **Qué decidí:** rechazar la propuesta y pedir precios más altos. Quedaron en Ciudad $70, Playa $95, Off-Road $140 y seguro de $25.
- **Por qué:** en la vida real rentar un coche no cuesta $28 USD al día, es mucho más caro; con precios irreales el cotizador daría totales que no le sirven a nadie.
- **Cómo lo verifiqué:** probé Match Playa del 10 al 14 de noviembre en mi app publicada. Dio 4 días y un total de $518 USD, igual al resultado que yo esperaba.

### Decisión 3: ubicación de los autos en el mapa (seguridad)

- **Qué propuso el IS:** 2 opciones: mostrar la ubicación exacta del auto o una zona aproximada de alrededor de 1 km. Me recomendó la zona aproximada.
- **Qué decidí:** aceptar la zona aproximada y rechazar la ubicación exacta.
- **Por qué:** quiero proteger siempre la casa y la información personal de la persona que renta su coche, para que tenga seguridad.
- **Cómo lo verifiqué:** publiqué un auto de prueba con mi ubicación y comprobé que apareciera en el mapa al usar **Buscar autos cerca de mí**.
