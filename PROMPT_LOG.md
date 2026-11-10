# Bitácora de prompts — Assignment 2: Cotizador de renta (RentaGo)

**Alumna:** Lauren Masri · Applied Algorithmic Thinking (Prof. Pedro Pascasio)
**App:** https://aat-mockup-lauren.vercel.app/
**Repo:** https://github.com/lmasria2012-ulibertad/aat-mockup-Lauren

---

## Paso 1 — Especificación (Checkpoint A, S19)

Funciones candidatas que consideré: (1) cotizador de renta, (2) buscador/filtro de autos, (3) precio con API de tipo de cambio.
**Elegí:** el cotizador de renta, porque ___ ✍️

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
- La IA propuso: un seguro de $5 por día. Yo pensé que era en pesos y no me hacía sentido.
- La IA aclaró que había asumido dólares porque mi mockup dice "$28/día", y me dio a elegir entre dólares (dejar el mockup igual) o pesos (cambiar todos los precios).
- **Mi decisión:** Revisar → me quedé con dólares. **Por qué:** ___ ✍️

**Decisión 2 — Precios no realistas** (campo en juego: *Qué datos necesita*)
- El mockup y la primera versión del cotizador usaban Ciudad $22, Playa $28, Off-Road $45 y seguro $5/día. La IA propuso subirlos a $45 / $65 / $95 y $15 de seguro.
- **Mi decisión:** Rechazar → pedí precios más altos y quedaron en Ciudad $70, Playa $95, Off-Road $140 y seguro $25/día. **Por qué:** ___ ✍️

**Decisión 2b — "Desde $X/día" usado como precio exacto** (campo en juego: *Qué datos necesita*)
- La IA propuso: tomar el precio "Desde $X/día" de las tarjetas como el precio por día del cálculo.
- **Mi decisión:** Aceptar / Rechazar / Revisar ___ **Por qué:** ___ ✍️

**Decisión 3 — Sobre qué se cobra la comisión** (campo en juego: *Qué hace*)
- La IA propuso: cobrar el 10% solo sobre el subtotal de la renta, sin incluir el seguro.
- **Mi decisión:** ___ **Por qué:** ___ ✍️

**Decisión 4 — Funcionalidad extra no pedida** (campo en juego: *Qué hace*)
- La IA agregó un link "Cotizar" en el menú de arriba, aunque no estaba en mi especificación.
- **Mi decisión:** ___ **Por qué:** ___ ✍️

---

## Paso 3 — Validación (antes de la S20)

Deploy confirmado: ☐ sí, la página responde en https://aat-mockup-lauren.vercel.app/

**Input exacto:** ___ ✍️ (por ejemplo: Match Playa, inicio 01/12/2026, fin 04/12/2026)

**Output real (copiado y pegado de la página, sin resumir):**
```
(pegar aquí)
```

**Veredicto:** Aceptar / Rechazar / Revisar ___
**Razón (1-2 líneas, citando algo específico del output):** ___ ✍️

---

## Uso de IA

- **Herramienta(s):** Claude (chat).
- **Para qué la usé:** ___ ✍️ (por ejemplo: generar ideas de funciones, programar el cotizador y su estilo, armar la estructura de esta bitácora)
- **Qué decidí o verifiqué yo:** ___ ✍️ (por ejemplo: la función elegida, la moneda, los valores de seguro y comisión, las decisiones del Paso 2 y la prueba real del Paso 3 en mi deploy)
