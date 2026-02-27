Estudiantes:
## Omar Salvador Garcia Vasquez SMSS093524
## Flor Marina Torres Jandres SMSS098424

#  Calculadora de Notas Universitarias

## Situación Problemática

**Sector:** Educación superior (universidades y institutos técnicos)

Muchos estudiantes universitarios no tienen una forma rápida y visual de calcular su nota final ponderada al finalizar un ciclo académico. Deben recurrir a calculadoras genéricas o hacer los cálculos manualmente, lo cual es propenso a errores y no ofrece un resumen consolidado de todas sus materias.

**Calculadora de notas** resuelve este problema permitiendo al estudiante ingresar sus notas de parciales y examen final, indicar la ponderación y visualizar instantáneamente si aprobó o reprobó cada materia, junto con un promedio global del ciclo — todo sin recargar la página.

---

## ¿Qué valor agregado tiene el uso de WebComponents a su proyecto?

El uso del WebComponent `<grade-card>` aporta **encapsulación y reusabilidad**: cada tarjeta de resultado es un elemento HTML personalizado que recibe sus datos como atributos (`subject`, `grade`, `category`, `passing`) y se auto-renderiza de forma independiente. Esto significa que agregar una nueva materia sólo requiere crear un elemento `<grade-card>` y añadirlo al DOM, sin duplicar lógica ni HTML. Si en el futuro se quisiera extender la funcionalidad (por ejemplo, agregar un tooltip con el desglose de notas), el cambio se hace **una sola vez dentro del componente** y aplica a todas las tarjetas existentes.

---

## ¿De qué forma manipularon los datos sin recargar la página?

Se utilizó JavaScript del lado del cliente con un array en memoria (`entries[]`) que actúa como fuente de verdad. Al hacer submit del formulario:

1. Se intercepta el evento con `e.preventDefault()` para evitar el comportamiento por defecto del navegador (que recargaría la página).
2. Se calculan los datos y se insertan en el array `entries`.
3. La función `renderAll()` limpia el contenedor de tarjetas (`container.innerHTML = ''`) y regenera los elementos `<grade-card>` dinámicamente con `document.createElement`.
4. Las estadísticas resumen se actualizan directamente mediante `textContent` sobre los elementos del DOM.

Todo ocurre en el mismo contexto de ejecución, sin peticiones HTTP ni navegación.

---

## ¿De qué forma validaron las entradas de datos? Expliquen brevemente

La validación se realizó en tres capas:

- **HTML nativo:** El `<form>` usa `novalidate` para deshabilitar los mensajes del navegador y manejar la UI manualmente.
- **Validación al envío:** La función `validate()` se ejecuta en el evento `submit`. Verifica que el nombre de la materia no esté vacío, que se haya seleccionado una categoría y que las tres notas numéricas estén en el rango 0–10.
- **Validación en tiempo real (blur):** Los campos numéricos corren `validateGrade()` al perder el foco, dando retroalimentación inmediata.
- **Feedback visual:** Los campos con error reciben la clase CSS `.error` (borde rojo) y un mensaje descriptivo aparece debajo de cada campo. Si el dato es corregido, los estilos de error se eliminan automáticamente.

---

## ¿Cómo manejaría la escalabilidad futura en su página?

Para escalar el proyecto se contemplan las siguientes estrategias:

1. **Persistencia:** Migrar el array en memoria a `localStorage` o a una base de datos (Firebase / Supabase) para conservar los datos entre sesiones.
2. **Componentización avanzada:** Convertir la vista completa en una SPA con un framework como Vue o React, aprovechando su sistema de componentes y gestión de estado (Pinia / Zustand).
3. **Autenticación:** Agregar login de estudiantes para que cada usuario tenga su propio historial de ciclos académicos.
4. **Módulos de WebComponents:** Separar cada componente personalizado en su propio archivo `.js` e importarlos con ES Modules (`<script type="module">`), facilitando el mantenimiento y las pruebas unitarias.
5. **Ponderaciones dinámicas:** Permitir que cada institución configure sus propias reglas de ponderación mediante un archivo de configuración JSON.
