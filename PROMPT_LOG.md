# Bitácora de prompts — Assignment 2: Cotizador de renta (RentaGo)

**Alumna:** Lauren Masri · Applied Algorithmic Thinking (Prof. Pedro Pascasio)
**App:** https://aat-mockup-lauren.vercel.app/
**Repo:** https://github.com/lmasria2012-ulibertad/aat-mockup-Lauren

---

## Paso 1 — Especificación (Checkpoint A, S19)

Funciones candidatas que consideré: (1) cotizador de renta, (2) buscador/filtro de autos, (3) precio con API de tipo de cambio.
**Elegí:** el cotizador de renta, porque siento que es la opción más realista: es lo primero que alguien quiere saber antes de rentar un auto (cuánto va a pagar en total).

**1. Qué hace**
El usuario elige un tipo de auto (Match Playa, Match Ciudad o Match Off-Road), una fecha de inicio y una fecha de fin. Al dar clic en "Calcular total", la app muestra: número de días, subtotal (días × precio por día), seguro ($25 USD por día), comisión de RentaGo (10% del subtotal) y el total en USD. Si la fecha de fin no es posterior a la de inicio, muestra un mensaje de error en lugar del cálculo.

**2. Qué datos/inputs necesita**
- **Precio por día de cada tipo de auto:** ya existe en mi app, en las tarjetas de "Cómo funciona" (Playa $95, Ciudad $70, Off-Road $140 USD).
- **Fecha de inicio y fecha de fin:** las escribe el usuario.
- **Seguro ($25 USD/día) y comisión (10%):** los agregué yo como valores fijos.
- **Regla de días:** días = fecha fin − fecha inicio (del 1 al 4 de diciembre = 3 días).

**3. Cómo sabré que funciona**
- **Caso 1:** Match Playa, del 01/12/2026 al 04/12/2026 → 3 días → subtotal $285.00 + seguro $75.00 + comisión $28.50 = **$388.50 USD**.
- **Caso 2 (error):** fecha de fin antes que la de inicio → debe salir un mensaje de error y no calcular ningún total.

---

## Paso 2 — Construcción: decisiones de aceptar / rechazar / revisar

Herramienta: Claude (chat). Prompt principal: "Programa el cotizador en mi index.html siguiendo mi especificación: [la especificación de arriba]".

Mientras construía, la IA tomó decisiones que **no estaban en mi especificación**:

**Decisión 1 — Moneda** (campo en juego: *Qué datos necesita*)
- La IA propuso un seguro de $5 por día. Yo lo leí en pesos y le dije que no tenía coherencia ($5 pesos al día de seguro no tiene sentido).
- La IA aclaró que había asumido dólares porque mi mockup decía "$28/día", y me dio a elegir: dólares (dejar el mockup igual) o pesos (cambiar todos los precios).
- **Mi decisión:** Revisar → me quedé con **dólares**. **Por qué:** una vez aclarado que eran dólares, $5 sí tenía sentido y no hacía falta cambiar la moneda de toda la app.

**Decisión 2 — Precios no realistas** (campo en juego: *Qué datos necesita*)
- El mockup y la primera versión del cotizador usaban Ciudad $22, Playa $28, Off-Road $45 y seguro $5/día. Cuestioné esos precios y la IA propuso subirlos a $45 / $65 / $95 y $15 de seguro.
- **Mi decisión:** Rechazar la propuesta de la IA → pedí precios más caros y quedaron en Ciudad $70, Playa $95, Off-Road $140 y seguro $25/día. **Por qué:** en la vida real rentar un coche no cuesta $28 USD al día, es mucho más caro; con precios irreales el cotizador daría totales que no le sirven a nadie.

---

## Paso 3 — Validación (antes de la S20)

Deploy confirmado: ✅ sí, la página responde en https://aat-mockup-lauren.vercel.app/ (sección "Cotizar").

**Input exacto:** Match Playa ($95 USD/día), fecha de inicio 11/10/2026, fecha de fin 11/14/2026.

**Output real (copiado tal cual de la página):**
```
Días de renta  4
Subtotal (4 × $95)  $380.00 USD
Seguro ($25/día)  $100.00 USD
Comisión RentaGo (10%)  $38.00 USD
Total  $518.00 USD
```

**Resultado esperado según mi especificación:** 14 − 10 = 4 días → 4 × $95 = $380 + seguro 4 × $25 = $100 + comisión 10% de $380 = $38 → **$518 USD**.

**Veredicto:** Aceptar.
**Razón:** el output contó 4 días (no 5), así que respeta mi regla "días = fecha fin − fecha inicio", y la comisión salió en $38.00, que es el 10% solo del subtotal de $380; el total de $518.00 USD coincide exacto con el resultado esperado según mi especificación.

---

## Uso de IA

- **Herramienta(s):** Claude (chat).
- **Para qué la usé:** proponer ideas de funciones, programar el cotizador (HTML/CSS/JavaScript), guiarme para subir los cambios a GitHub y ayudarme a redactar esta bitácora a partir de mis decisiones.
- **Qué decidí o verifiqué yo:** elegí la función (cotizador), los inputs (tipo de auto + fechas) y que incluyera seguro y comisión; decidí la moneda (dólares) y rechacé los precios que propuso la IA por no ser realistas; hice la prueba real en mi deploy y revisé que el total coincidiera con el resultado esperado según mi especificación.
