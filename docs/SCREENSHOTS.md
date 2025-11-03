# Guía de Capturas de Pantalla
## Sistema de Gestión Académica Completa

---

**Propósito**: Este documento guía la captura de pantallas del sistema funcionando para incluir en la documentación del Trabajo Práctico Final Integrador.

---

## 📋 Índice

1. [Requisitos Técnicos](#requisitos-técnicos)
2. [Listado de Capturas Requeridas](#listado-de-capturas-requeridas)
3. [Instrucciones por Captura](#instrucciones-por-captura)
4. [Consejos para Mejores Capturas](#consejos-para-mejores-capturas)

---

## Requisitos Técnicos

### Herramientas de Captura

**Windows**:
- **Método 1**: Tecla `Windows + Shift + S` (Recorte de pantalla)
- **Método 2**: Aplicación "Recortes" (Snipping Tool)
- **Método 3**: `PrtScn` (Captura pantalla completa)

**Alternativas con más funciones**:
- Greenshot (gratuito): [https://getgreenshot.org/](https://getgreenshot.org/)
- Lightshot (gratuito): [https://app.prntscr.com/](https://app.prntscr.com/)
- ShareX (gratuito): [https://getsharex.com/](https://getsharex.com/)

### Configuración del Navegador

- **Navegador recomendado**: Google Chrome o Microsoft Edge
- **Resolución**: 1920x1080 (Full HD) o superior
- **Zoom**: 100% (sin zoom aplicado)
- **Modo**: Pantalla completa (F11) o ventana maximizada

### Formato de Archivos

- **Formato**: PNG (sin compresión, mejor calidad)
- **Nomenclatura**: `nombre_descriptivo.png` (sin espacios, usar guiones bajos)
- **Carpeta**: Guardar todas en `docs/screenshots/`

---

## Listado de Capturas Requeridas

| # | Nombre del Archivo | Descripción | Prioridad |
|---|-------------------|-------------|-----------|
| 1 | `01_dashboard_principal.png` | Vista del dashboard con sidebar visible | ⭐⭐⭐ Esencial |
| 2 | `02_alumnos_listado.png` | Tabla de alumnos con datos cargados | ⭐⭐⭐ Esencial |
| 3 | `03_modal_crear_alumno.png` | Modal de creación de nuevo alumno | ⭐⭐⭐ Esencial |
| 4 | `04_modal_editar_alumno.png` | Modal de edición con datos pre-cargados | ⭐⭐ Importante |
| 5 | `05_modal_ver_notas.png` | Modal mostrando notas de un alumno | ⭐⭐ Importante |
| 6 | `06_pruebas_listado.png` | Tabla de pruebas/evaluaciones | ⭐⭐ Importante |
| 7 | `07_estadisticas_general.png` | Página de estadísticas completa (vista general) | ⭐⭐⭐ Esencial |
| 8 | `08_estadisticas_metricas.png` | Detalle de tarjetas de métricas | ⭐⭐ Importante |
| 9 | `09_grafico_genero.png` | Gráfico de dona con distribución de género | ⭐⭐⭐ Esencial |
| 10 | `10_panel_rendimiento.png` | Panel de rendimiento académico con barra de progreso | ⭐⭐⭐ Esencial |
| 11 | `11_tabla_aulas.png` | Tabla de estadísticas por aula con paginación | ⭐⭐⭐ Esencial |
| 12 | `12_tabla_materias.png` | Tabla de estadísticas por materia | ⭐⭐ Importante |
| 13 | `13_filtros_aplicados.png` | Estadísticas con filtro de institución aplicado | ⭐⭐⭐ Esencial |
| 14 | `14_paginacion_activa.png` | Detalle de controles de paginación | ⭐ Opcional |
| 15 | `15_responsive_mobile.png` | Vista móvil del sistema (simulador) | ⭐ Opcional |

**Total mínimo requerido**: 10 capturas esenciales  
**Total recomendado**: 15 capturas completas

---

## Instrucciones por Captura

### 1. Dashboard Principal (`01_dashboard_principal.png`)

**Objetivo**: Mostrar la página de inicio del sistema con sidebar y contenido principal.

**Pasos**:
1. Abrir el navegador e ir a `http://localhost/alumnos_academico_app/`
2. Asegurarse de que el sidebar esté visible
3. Verificar que se muestren las tarjetas de métricas principales
4. Capturar la pantalla completa

**Elementos que deben verse**:
- ✅ Sidebar con logo y menú de navegación
- ✅ Título "Dashboard - Sistema de Gestión Académica"
- ✅ Tarjetas de estadísticas (Total Instituciones, Aulas, Profesores, Materias, Alumnos)
- ✅ Botones de acción ("Nueva Institución", "Nuevo Profesor", etc.)

---

### 2. Listado de Alumnos (`02_alumnos_listado.png`)

**Objetivo**: Demostrar la gestión de alumnos con datos reales.

**Pasos**:
1. Navegar a "Alumnos" desde el sidebar
2. Esperar a que la tabla cargue completamente
3. Verificar que hay al menos 15 alumnos visibles
4. Capturar la tabla completa con encabezados

**Elementos que deben verse**:
- ✅ Encabezados de columna (ID, Nombre, Apellido, DNI, Edad, Género, Aula, Institución, Acciones)
- ✅ Mínimo 15 filas de datos
- ✅ Botones de acción (Ver notas, Editar, Eliminar)
- ✅ Botón "Nuevo Alumno" en la parte superior

---

### 3. Modal Crear Alumno (`03_modal_crear_alumno.png`)

**Objetivo**: Mostrar el formulario de creación de nuevo alumno.

**Pasos**:
1. En la página de alumnos, hacer clic en "Nuevo Alumno"
2. Esperar a que se abra el modal de SweetAlert2
3. **NO llenar los campos** (dejarlos vacíos para la captura)
4. Capturar el modal centrado

**Elementos que deben verse**:
- ✅ Título del modal: "Nuevo Alumno"
- ✅ Campos: Nombre, Apellido, DNI, Edad, Género (select), Aula (select), Institución (select)
- ✅ Botones: "Guardar" y "Cancelar"
- ✅ Fondo oscurecido (overlay)

---

### 4. Modal Editar Alumno (`04_modal_editar_alumno.png`)

**Objetivo**: Mostrar el formulario de edición con datos pre-cargados.

**Pasos**:
1. En la tabla de alumnos, hacer clic en el botón "Editar" (icono de lápiz) de cualquier alumno
2. Esperar a que se abra el modal con datos
3. Verificar que los campos estén llenos con información del alumno
4. Capturar el modal

**Elementos que deben verse**:
- ✅ Título: "Editar Alumno"
- ✅ Campos pre-llenados con datos reales
- ✅ Botones: "Actualizar" y "Cancelar"

---

### 5. Modal Ver Notas (`05_modal_ver_notas.png`)

**Objetivo**: Mostrar el historial de notas de un alumno.

**Pasos**:
1. En la tabla de alumnos, hacer clic en "Ver notas" (icono de ojo) de un alumno que tenga notas cargadas
2. Esperar a que se abra el modal con la lista de notas
3. Verificar que se muestre al menos una nota
4. Capturar el modal completo

**Elementos que deben verse**:
- ✅ Nombre del alumno en el título
- ✅ Tabla con columnas: Materia, Prueba, Fecha, Nota
- ✅ Al menos 3-5 filas de notas
- ✅ Botón "Cerrar"

---

### 6. Listado de Pruebas (`06_pruebas_listado.png`)

**Objetivo**: Mostrar la gestión de evaluaciones.

**Pasos**:
1. Navegar a "Pruebas" desde el sidebar
2. Esperar carga completa de la tabla
3. Verificar que hay pruebas listadas
4. Capturar la vista completa

**Elementos que deben verse**:
- ✅ Tabla con columnas: ID, Nombre, Fecha, Aula, Materia, Acciones
- ✅ Datos de pruebas (mínimo 10 filas)
- ✅ Botón "Nueva Prueba"

---

### 7. Estadísticas General (`07_estadisticas_general.png`)

**Objetivo**: Captura completa de la página de estadísticas (la más importante).

**Pasos**:
1. Navegar a "Estadísticas" desde el sidebar
2. Esperar a que carguen todos los componentes:
   - Tarjetas de métricas
   - Gráfico de género
   - Panel de rendimiento
   - Tablas de aulas y materias
3. Si no cabe todo en pantalla, hacer scroll hacia arriba para capturar desde el inicio
4. Capturar la vista completa

**Elementos que deben verse**:
- ✅ Filtros (Institución y Aula)
- ✅ 4 tarjetas de métricas con números
- ✅ Panel de rendimiento (izquierda) con barra de progreso
- ✅ Gráfico de dona (derecha)
- ✅ Inicio de las tablas (Aulas y Materias)

**Nota**: Esta es la captura más importante, tomar tiempo para que se vea perfecta.

---

### 8. Métricas en Detalle (`08_estadisticas_metricas.png`)

**Objetivo**: Close-up de las tarjetas de métricas.

**Pasos**:
1. En la página de estadísticas, hacer zoom al 125% (Ctrl + scroll)
2. Centrar la vista en las 4 tarjetas superiores (Alumnos, Aulas, Profesores, Materias)
3. Capturar solo esa sección

**Elementos que deben verse**:
- ✅ 4 tarjetas con colores distintos (gradientes)
- ✅ Iconos de Font Awesome
- ✅ Números grandes y legibles
- ✅ Etiquetas descriptivas

---

### 9. Gráfico de Género (`09_grafico_genero.png`)

**Objetivo**: Mostrar el gráfico circular con leyenda de porcentajes.

**Pasos**:
1. En estadísticas, hacer scroll hasta el gráfico de dona
2. Hacer zoom al 150% para que se vea más grande
3. Centrar el gráfico y la leyenda inferior
4. Capturar

**Elementos que deben verse**:
- ✅ Gráfico de dona con 2 colores (rosa y azul)
- ✅ Leyenda inferior con:
   - Punto rosa + "Femenino: XX% (YY alumnos)"
   - Punto azul + "Masculino: XX% (YY alumnos)"

---

### 10. Panel de Rendimiento (`10_panel_rendimiento.png`)

**Objetivo**: Mostrar la barra de progreso y métricas de rendimiento.

**Pasos**:
1. En estadísticas, ubicar el panel "Rendimiento Académico General"
2. Hacer zoom al 125%
3. Capturar solo ese panel completo

**Elementos que deben verse**:
- ✅ Título del panel
- ✅ Número grande del promedio (ej: "7.23")
- ✅ Barra de progreso con gradiente azul/morado
- ✅ Contadores de aprobados y desaprobados (con iconos ✓ y ✗)

---

### 11. Tabla de Aulas (`11_tabla_aulas.png`)

**Objetivo**: Mostrar la tabla de estadísticas por aula con paginación.

**Pasos**:
1. En estadísticas, hacer scroll hasta la tabla "Estadísticas por Aula"
2. Verificar que muestre 7 filas (configuración por defecto)
3. Asegurarse de que los controles de paginación estén visibles
4. Capturar la tabla completa con paginador

**Elementos que deben verse**:
- ✅ Encabezados: Aula, Total, ♂ / ♀, Edad prom., Promedio
- ✅ 7 filas de datos
- ✅ Selector "Mostrar 7 registros" (izquierda)
- ✅ Botones de navegación (Anterior / Siguiente) y "Página X de Y"

---

### 12. Tabla de Materias (`12_tabla_materias.png`)

**Objetivo**: Mostrar estadísticas por materia.

**Pasos**:
1. En estadísticas, hacer scroll hasta la tabla "Estadísticas por Materia"
2. Capturar la tabla completa

**Elementos que deben verse**:
- ✅ Encabezados: Materia, Profesor, Evaluaciones, Promedio, Aprobados, Desaprobados
- ✅ Datos de materias con promedios
- ✅ Paginación

---

### 13. Filtros Aplicados (`13_filtros_aplicados.png`)

**Objetivo**: Demostrar funcionalidad de filtrado dinámico.

**Pasos**:
1. En la página de estadísticas, seleccionar una institución del filtro superior
2. Esperar a que se recalculen todas las métricas
3. Verificar que los números cambiaron
4. Capturar la vista completa mostrando:
   - Filtro con valor seleccionado
   - Nuevas métricas
   - Gráficos actualizados

**Elementos que deben verse**:
- ✅ Select de institución con un valor seleccionado (no "Todas")
- ✅ Tarjetas de métricas con números diferentes al global
- ✅ Gráficos actualizados según el filtro

---

### 14. Paginación Activa (`14_paginacion_activa.png`)

**Objetivo**: Mostrar los controles de paginación en acción.

**Pasos**:
1. En cualquier tabla con paginación (Aulas o Materias)
2. Hacer clic en "Siguiente" para ir a página 2
3. Hacer zoom al 150% en los controles de paginación
4. Capturar solo esa sección

**Elementos que deben verse**:
- ✅ Botón "Anterior" activo (no deshabilitado)
- ✅ Indicador "Página 2 de X"
- ✅ Botón "Siguiente" (activo o deshabilitado según sea última página)
- ✅ Selector de cantidad de registros

---

### 15. Vista Responsive (Móvil) (`15_responsive_mobile.png`)

**Objetivo**: Demostrar adaptabilidad a dispositivos móviles.

**Pasos**:
1. Abrir el navegador Chrome
2. Presionar `F12` para abrir DevTools
3. Presionar `Ctrl + Shift + M` para activar modo dispositivo
4. Seleccionar "iPhone 12 Pro" o "Pixel 5"
5. Navegar por el sistema
6. Capturar una vista representativa (puede ser dashboard o estadísticas)

**Elementos que deben verse**:
- ✅ Layout adaptado al ancho móvil
- ✅ Sidebar colapsado o en hamburger menu
- ✅ Tarjetas en columna única
- ✅ Tablas con scroll horizontal

---

## Consejos para Mejores Capturas

### Antes de Capturar

1. **Limpia tu navegador**:
   - Cierra todas las pestañas innecesarias
   - Oculta la barra de marcadores (Ctrl + Shift + B)
   - Usa modo incógnito si quieres barra limpia

2. **Prepara los datos**:
   - Verifica que haya suficientes registros en la base de datos
   - Asegúrate de que las notas estén cargadas para varios alumnos
   - Confirma que los filtros funcionen correctamente

3. **Configura el entorno**:
   - Cierra notificaciones del sistema
   - Pon el navegador en pantalla completa (F11) o ventana maximizada
   - Ajusta el zoom al 100%

### Durante la Captura

1. **Timing**:
   - Espera a que todos los elementos carguen (spinners, gráficos)
   - No captures durante animaciones o transiciones

2. **Enfoque**:
   - Captura solo lo necesario (evita barras de Windows innecesarias)
   - Centra el contenido importante

3. **Calidad**:
   - Usa formato PNG (no JPG, pierde calidad)
   - No redimensiones las imágenes después de capturar

### Después de Capturar

1. **Revisión**:
   - Abre cada imagen y verifica que sea legible
   - Confirma que no haya información sensible (contraseñas, etc.)
   - Verifica que los nombres de archivo sean correctos

2. **Organización**:
   - Guarda todas en `docs/screenshots/`
   - Usa nombres descriptivos con numeración (`01_`, `02_`, etc.)
   - Crea un archivo `README.md` en esa carpeta listando las imágenes

3. **Optimización (opcional)**:
   - Usa TinyPNG para reducir tamaño sin perder calidad: [https://tinypng.com/](https://tinypng.com/)
   - No reduzcas más del 50% para mantener legibilidad

---

## Checklist Final

Antes de dar por terminadas las capturas, verifica:

- [ ] Tienes al menos 10 capturas de las marcadas como "Esencial"
- [ ] Todas las imágenes están en formato PNG
- [ ] Los nombres de archivo siguen la convención establecida
- [ ] Todas las capturas están guardadas en `docs/screenshots/`
- [ ] Las imágenes son legibles (texto claro, colores bien visibles)
- [ ] No hay información sensible en las capturas
- [ ] Tienes una captura que muestre cada funcionalidad clave del sistema

---

## Uso de las Capturas

Estas imágenes se utilizarán en:

1. **README.md**: Insertadas con sintaxis `![Descripción](docs/screenshots/nombre.png)`
2. **Documento PDF**: Importadas como figuras con pies de foto
3. **Presentación**: Incluidas en slides para demostración

**Ejemplo de inserción en Markdown**:
```markdown
### Vista del Dashboard

![Dashboard Principal](docs/screenshots/01_dashboard_principal.png)

*Figura 1: Pantalla principal del sistema mostrando el sidebar de navegación y tarjetas de métricas.*
```

---

**Documento creado para**: Trabajo Práctico Final Integrador  
**Sistema**: Gestión Académica Completa  
**Fecha**: Noviembre 2025
