# DOCUMENTO TÉCNICO COMPLETO
## Sistema de Gestión Académica - TP Final Integrador

---

## 1. INTRODUCCIÓN

### 1.1. Contexto del Proyecto

El presente proyecto corresponde al **Trabajo Práctico Final Integrador** de las asignaturas  **Análisis de Datos**, desarrollado durante el ciclo lectivo 2025.

### 1.2. Problemática Abordada

Las instituciones educativas enfrentan dificultades para:
- Gestionar información dispersa de alumnos, aulas, profesores y materias
- Realizar seguimiento del rendimiento académico
- Generar estadísticas y análisis de datos
- Tomar decisiones basadas en información confiable

### 1.3. Propuesta de Solución

Sistema web integral que centraliza la gestión académica, permitiendo:
- **CRUD completo** de todas las entidades (alumnos, aulas, materias, etc.)
- **Visualización de datos** con gráficos interactivos
- **Análisis estadístico** por institución, aula y materia
- **Interfaz amigable** y responsive

### 1.4. Objetivos Académicos

**Base de Datos:**
- Diseño de modelo ER completo
- Normalización hasta 3FN
- Implementación en MySQL con integridad referencial

**Análisis de Datos:**
- Consultas SQL complejas (JOIN, agregaciones, subconsultas)
- Visualizaciones con gráficos (Chart.js)
- Métricas y KPIs educativos

---

## 2. DOMINIO DEL PROBLEMA

### 2.1. Descripción del Dominio

El sistema modela el **entorno educativo** de una o más instituciones, abarcando:

**Entidades principales:**
1. **Instituciones**: Establecimientos educativos
2. **Profesores**: Docentes que imparten clases
3. **Aulas**: Cursos/divisiones (ej: 1ero A, 2do B)
4. **Materias**: Asignaturas del plan de estudios
5. **Alumnos**: Estudiantes inscriptos en aulas
6. **Pruebas**: Evaluaciones/exámenes
7. **Notas**: Calificaciones de alumnos en pruebas

### 2.2. Reglas del Negocio

1. Una **institución** puede tener muchas **aulas**
2. Un **aula** pertenece a una sola **institución**
3. Un **aula** tiene un solo **profesor** asignado (preceptor)
4. Un **alumno** está inscripto en una sola **aula**
5. Un **aula** puede tener muchos **alumnos**
6. Una **aula** imparte varias **materias** (relación N:M)
7. Una **prueba** pertenece a una **aula** y una **materia**
8. Las **notas** relacionan **alumnos** con **pruebas**

### 2.3. Requisitos Funcionales

**RF1:** CRUD de instituciones, profesores, aulas, materias y alumnos  
**RF2:** Gestión de pruebas/evaluaciones con asignación de notas  
**RF3:** Visualización de notas por alumno  
**RF4:** Cálculo automático de promedios  
**RF5:** Estadísticas por institución, aula y materia  
**RF6:** Gráficos de distribución de alumnos por género  
**RF7:** Filtros dinámicos en estadísticas  
**RF8:** Validaciones de integridad en formularios  

### 2.4. Requisitos No Funcionales

**RNF1:** Interfaz responsive adaptable a móviles y tablets  
**RNF2:** Tiempo de respuesta < 2 segundos  
**RNF3:** Base de datos normalizada (3FN)  
**RNF4:** Código PHP con validaciones de seguridad  
**RNF5:** Diseño moderno con gradientes y animaciones  

---

## 3. DISEÑO DE LA BASE DE DATOS

### 3.1. Modelo Entidad-Relación

**Entidades y Atributos:**

#### 3.1.1. Instituciones
- **id_institucion** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(100), NOT NULL)
- **direccion** (VARCHAR(200))
- **telefono** (VARCHAR(20))
- **email** (VARCHAR(100))

#### 3.1.2. Profesores
- **id_profesor** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(50), NOT NULL)
- **apellido** (VARCHAR(50), NOT NULL)
- **email** (VARCHAR(100))
- **telefono** (VARCHAR(20))
- **dni** (VARCHAR(20), UNIQUE)

#### 3.1.3. Aulas
- **id_aula** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(50), NOT NULL)
- **grado** (INT)
- **turno** (ENUM: 'Mañana', 'Tarde', 'Noche')
- **id_institucion** (FK → instituciones)
- **id_profesor** (FK → profesores)

#### 3.1.4. Materias
- **id_materia** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(100), NOT NULL)
- **descripcion** (TEXT)

#### 3.1.5. Aula_Materia (Tabla Intermedia)
- **id_aula_materia** (PK, INT, AUTO_INCREMENT)
- **id_aula** (FK → aulas)
- **id_materia** (FK → materias)
- UNIQUE (id_aula, id_materia)

#### 3.1.6. Alumnos
- **id_alumno** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(50), NOT NULL)
- **apellido** (VARCHAR(50), NOT NULL)
- **dni** (VARCHAR(20), UNIQUE)
- **edad** (INT)
- **genero** (ENUM: 'Masculino', 'Femenino', 'Otro')
- **id_aula** (FK → aulas)

#### 3.1.7. Pruebas
- **id_prueba** (PK, INT, AUTO_INCREMENT)
- **nombre** (VARCHAR(100), NOT NULL)
- **fecha** (DATE)
- **id_aula** (FK → aulas)
- **id_materia** (FK → materias)

#### 3.1.8. Notas
- **id_nota** (PK, INT, AUTO_INCREMENT)
- **calificacion** (DECIMAL(4,2), CHECK: 1-10)
- **id_alumno** (FK → alumnos)
- **id_prueba** (FK → pruebas)
- UNIQUE (id_alumno, id_prueba)

### 3.2. Cardinalidades

```
INSTITUCIONES (1) ──────< (N) AULAS
PROFESORES (1) ──────< (N) AULAS
AULAS (1) ──────< (N) ALUMNOS
AULAS (N) >──────< (M) MATERIAS  [vía aula_materia]
AULAS (1) ──────< (N) PRUEBAS
MATERIAS (1) ──────< (N) PRUEBAS
ALUMNOS (1) ──────< (N) NOTAS
PRUEBAS (1) ──────< (N) NOTAS
```

### 3.3. Claves Foráneas y Acciones

| FK | Tabla Origen | Tabla Destino | ON DELETE | ON UPDATE |
|----|--------------|---------------|-----------|-----------|
| id_institucion | aulas | instituciones | SET NULL | CASCADE |
| id_profesor | aulas | profesores | SET NULL | CASCADE |
| id_aula | alumnos | aulas | SET NULL | CASCADE |
| id_aula | aula_materia | aulas | CASCADE | CASCADE |
| id_materia | aula_materia | materias | CASCADE | CASCADE |
| id_aula | pruebas | aulas | CASCADE | CASCADE |
| id_materia | pruebas | materias | CASCADE | CASCADE |
| id_alumno | notas | alumnos | CASCADE | CASCADE |
| id_prueba | notas | pruebas | CASCADE | CASCADE |

**Justificación:**
- **SET NULL**: Para aulas sin institución/profesor asignado
- **CASCADE**: Para mantener integridad en relaciones fuertes

---

## 4. NORMALIZACIÓN

### 4.1. Primera Forma Normal (1FN)

**Regla:** Todos los atributos deben ser atómicos (indivisibles)

**Aplicación:**
- ✅ `nombre` y `apellido` separados en `alumnos` y `profesores`
- ✅ `direccion` en una sola columna (no dividida en calle, número, etc.)
- ✅ Sin atributos multivaluados (género es enum de un solo valor)

**Ejemplo:**
```
❌ Incorrecto: nombre_completo = "Juan Pérez"
✅ Correcto: nombre = "Juan", apellido = "Pérez"
```

### 4.2. Segunda Forma Normal (2FN)

**Regla:** Estar en 1FN + Todos los atributos no clave deben depender de TODA la clave primaria

**Aplicación:**
- En `notas`, `calificacion` depende de (id_alumno, id_prueba) → OK
- En `aula_materia`, no hay atributos no clave → OK
- Cada tabla tiene PK simple (id_* auto_increment) → Cumple automáticamente

**Ejemplo:**
```
✅ notas (id_alumno, id_prueba, calificacion)
   calificacion depende de ambos campos clave
```

### 4.3. Tercera Forma Normal (3FN)

**Regla:** Estar en 2FN + Sin dependencias transitivas

**Aplicación:**
- En `alumnos`, `edad` y `genero` dependen directamente de `id_alumno`, no de otros atributos no clave
- Si quisiéramos `nombre_institucion` en `aulas`, sería transitivo (`id_aula` → `id_institucion` → `nombre`) → Por eso usamos FK

**Ejemplo:**
```
❌ Incorrecto: aulas (id_aula, nombre_aula, nombre_institucion)
   nombre_institucion depende de id_institucion (transitivo)

✅ Correcto: aulas (id_aula, nombre_aula, id_institucion)
   instituciones (id_institucion, nombre_institucion)
```

### 4.4. Verificación del Diseño

Todas las tablas cumplen 3FN:

| Tabla | 1FN | 2FN | 3FN |
|-------|-----|-----|-----|
| instituciones | ✅ | ✅ | ✅ |
| profesores | ✅ | ✅ | ✅ |
| aulas | ✅ | ✅ | ✅ |
| materias | ✅ | ✅ | ✅ |
| aula_materia | ✅ | ✅ | ✅ |
| alumnos | ✅ | ✅ | ✅ |
| pruebas | ✅ | ✅ | ✅ |
| notas | ✅ | ✅ | ✅ |

---

## 5. IMPLEMENTACIÓN DEL SISTEMA

### 5.1. Arquitectura de Tres Capas

```
┌─────────────────────────────────────┐
│   CAPA DE PRESENTACIÓN              │
│   (HTML + CSS + JavaScript)         │
│   - index.html                       │
│   - alumnos.html                     │
│   - estadisticas.html                │
│   - styles_new.css                   │
│   - script.js / alumnos.js / etc.   │
└─────────────┬───────────────────────┘
              │ AJAX (fetch)
              ↓
┌─────────────────────────────────────┐
│   CAPA DE LÓGICA (Backend)          │
│   (PHP)                              │
│   - api.php                          │
│   - Validaciones                     │
│   - Consultas SQL                    │
└─────────────┬───────────────────────┘
              │ MySQLi
              ↓
┌─────────────────────────────────────┐
│   CAPA DE DATOS (Base de Datos)     │
│   (MySQL)                            │
│   - db_alumnoss                      │
│   - 8 tablas normalizadas            │
└─────────────────────────────────────┘
```

### 5.2. Capa de Presentación (Frontend)

#### 5.2.1. Tecnologías
- HTML5 (estructura semántica)
- CSS3 (Flexbox, Grid, Gradientes)
- JavaScript ES6+ (async/await, fetch API)
- Chart.js 3.9.1 (gráficos)
- Font Awesome 6.4.0 (iconos)
- SweetAlert2 (modales elegantes)

#### 5.2.2. Estructura de Archivos
```
index.html          → Dashboard principal + CRUD de entidades
alumnos.html        → Gestión completa de alumnos
estadisticas.html   → Panel de análisis y visualizaciones
pruebas.html        → Gestión de evaluaciones y notas
styles_new.css      → Estilos unificados
script.js           → Lógica de index.html
alumnos.js          → Lógica de alumnos.html
estadisticas.js     → Lógica de gráficos y métricas
pruebas.js          → Lógica de pruebas y notas
```

#### 5.2.3. Características de UX/UI
- **Sidebar responsivo** con navegación intuitiva
- **Modales optimizados** sin scroll innecesario
- **Gradientes azul-morado** (colores institucionales)
- **Feedback visual** con SweetAlert2
- **Validaciones en tiempo real** en formularios
- **Tablas con paginación** (7/10/20 registros por página)
- **Gráficos interactivos** con tooltips

### 5.3. Capa de Lógica (Backend)

#### 5.3.1. Archivo api.php

Implementa **patrón MVC simplificado** con acciones:

**Instituciones:**
- `getInstituciones`: Listar todas
- `createInstitucion`: Crear nueva
- `updateInstitucion`: Actualizar existente
- `deleteInstitucion`: Eliminar

**Profesores:**
- `getProfesores`, `createProfesor`, `updateProfesor`, `deleteProfesor`

**Aulas:**
- `getAulas`, `getAulasPorInstitucion`, `createAula`, `updateAula`, `deleteAula`

**Materias:**
- `getMaterias`, `createMateria`, `updateMateria`, `deleteMateria`

**Alumnos:**
- `getAlumnos`: Listar con JOIN de aula e institución
- `getAlumnoById`: Obtener detalle individual
- `createAlumno`, `updateAlumno`, `deleteAlumno`
- `getNotasAlumno`: Historial de calificaciones

**Pruebas:**
- `getPruebas`, `createPrueba`, `updatePrueba`, `deletePrueba`

**Notas:**
- `getNotas`, `createNota`, `updateNota`, `deleteNota`

**Estadísticas:**
- `getEstadisticas`: Métricas generales (totales, promedios, género)
- `getEstadisticasPorAula`: Datos agrupados por aula
- `getEstadisticasPorMateria`: Datos agrupados por materia

#### 5.3.2. Seguridad Implementada

```php
// Validación de acción
$action = isset($_GET['action']) ? $_GET['action'] : '';
if (!$action) {
    http_response_code(400);
    echo json_encode(["error" => "Acción no especificada"]);
    exit;
}

// Prevención de SQL Injection con Prepared Statements
$stmt = $conn->prepare("SELECT * FROM alumnos WHERE id_alumno = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

// Headers CORS para desarrollo local
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
```

### 5.4. Capa de Datos (Base de Datos)

#### 5.4.1. Conexión

```php
$host = "localhost";
$user = "root";
$pass = "";
$db = "db_alumnoss";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");
```

#### 5.4.2. Ejemplos de Consultas

**Listado de alumnos con datos relacionados:**
```sql
SELECT 
    a.id_alumno,
    a.nombre,
    a.apellido,
    a.dni,
    a.edad,
    a.genero,
    au.nombre AS aula,
    i.nombre AS institucion
FROM alumnos a
LEFT JOIN aulas au ON a.id_aula = au.id_aula
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion
ORDER BY a.apellido, a.nombre;
```

**Notas de un alumno:**
```sql
SELECT 
    m.nombre AS materia,
    p.nombre AS prueba,
    p.fecha,
    n.calificacion
FROM notas n
INNER JOIN pruebas p ON n.id_prueba = p.id_prueba
INNER JOIN materias m ON p.id_materia = m.id_materia
WHERE n.id_alumno = ?
ORDER BY p.fecha DESC;
```

**Estadísticas por aula:**
```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id_alumno) AS total_alumnos,
    SUM(CASE WHEN a.genero = 'Masculino' THEN 1 ELSE 0 END) AS masculino,
    SUM(CASE WHEN a.genero = 'Femenino' THEN 1 ELSE 0 END) AS femenino,
    AVG(a.edad) AS edad_promedio,
    AVG(n.calificacion) AS promedio_notas
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
LEFT JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY au.id_aula, au.nombre
HAVING COUNT(a.id_alumno) > 0
ORDER BY au.nombre;
```

---

## 6. ANÁLISIS DE DATOS Y VISUALIZACIONES

### 6.1. Módulo de Estadísticas

**Ubicación:** `estadisticas.html` + `estadisticas.js`

**Componentes:**

#### 6.1.1. Filtros Dinámicos
```javascript
// Selector de institución (actualiza aulas y métricas)
filtroInstitucion.addEventListener('change', actualizarFiltros);

// Selector de aula (dependiente de institución)
filtroAula.addEventListener('change', aplicarFiltros);

// Limpiar filtros
btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
```

#### 6.1.2. Tarjetas de Métricas (KPIs)
- **Total Alumnos**: Contador con ícono de graduado
- **Total Aulas**: Contador con ícono de aula
- **Total Profesores**: Contador con ícono de docente
- **Total Materias**: Contador con ícono de libro

Cada tarjeta tiene gradiente único y se actualiza con los filtros.

#### 6.1.3. Panel de Rendimiento Académico
```javascript
// Cálculo de promedio general
const promedio = calcularPromedio(notas);
promedioElement.textContent = promedio.toFixed(2);

// Barra de progreso
const porcentaje = (promedio / 10) * 100;
progressBar.style.width = `${porcentaje}%`;

// Contadores de aprobados/desaprobados
const aprobados = notas.filter(n => n >= 6).length;
const desaprobados = notas.filter(n => n < 6).length;
```

#### 6.1.4. Gráfico de Distribución por Género
```javascript
// Chart.js - Doughnut Chart
const chartGenero = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Femenino', 'Masculino'],
        datasets: [{
            data: [cantidadFemenino, cantidadMasculino],
            backgroundColor: ['#ec4899', '#3b82f6'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b);
                        const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${porcentaje}%)`;
                    }
                }
            }
        }
    }
});
```

#### 6.1.5. Tablas Analíticas

**Tabla 1: Estadísticas por Aula**
- Aula, Total alumnos, Masculino/Femenino, Edad promedio, Promedio notas

**Tabla 2: Estadísticas por Materia**
- Materia, Profesor, Evaluaciones, Promedio, Aprobados, Desaprobados

Ambas con sistema de paginación (7/10/20 registros):
```javascript
function paginar(data, registrosPorPagina, paginaActual) {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    return data.slice(inicio, fin);
}
```

### 6.2. Insights del Análisis

**Para directivos:**
- Identificar aulas con bajo rendimiento
- Detectar materias con alta tasa de desaprobación
- Balancear distribución de género
- Monitorear carga de trabajo de profesores

**Para docentes:**
- Ver promedio de su materia vs otras
- Comparar rendimiento entre aulas
- Planificar estrategias de refuerzo

**Para administración:**
- Estadísticas totales del sistema
- Reportes por institución
- Evolución temporal (si se agregan filtros de fecha)

---

## 7. FUNCIONALIDADES DESTACADAS

### 7.1. CRUD Completo con Modales

**Ventajas:**
- Sin recargas de página (SPA-like behavior)
- Feedback inmediato con SweetAlert2
- Validaciones antes de enviar

**Ejemplo de flujo (Crear Alumno):**
```javascript
// 1. Abrir modal
btnNuevoAlumno.addEventListener('click', abrirModalNuevoAlumno);

// 2. Cargar selectores dinámicos
async function cargarInstituciones() {
    const instituciones = await fetch('/api.php?action=getInstituciones').then(r => r.json());
    selectInstitucion.innerHTML = instituciones.map(i => 
        `<option value="${i.id_institucion}">${i.nombre}</option>`
    ).join('');
}

// 3. Validar formulario
formNuevoAlumno.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    const data = new FormData(formNuevoAlumno);
    const response = await fetch('/api.php?action=createAlumno', {
        method: 'POST',
        body: data
    });
    
    if (response.ok) {
        Swal.fire('¡Éxito!', 'Alumno creado', 'success');
        cerrarModal();
        cargarAlumnos(); // Refrescar tabla
    }
});
```

### 7.2. Notas de Alumnos con Promedio

```javascript
async function mostrarNotasAlumno(idAlumno) {
    const notas = await fetch(`/api.php?action=getNotasAlumno&id=${idAlumno}`)
        .then(r => r.json());
    
    // Calcular promedio
    const promedio = notas.reduce((sum, n) => sum + parseFloat(n.calificacion), 0) / notas.length;
    
    // Determinar estado
    const estado = promedio >= 6 ? 'Aprobado' : 'Desaprobado';
    const color = promedio >= 6 ? 'green' : 'red';
    
    // Mostrar en modal
    tablaNotas.innerHTML = notas.map(n => `
        <tr>
            <td>${n.materia}</td>
            <td>${n.prueba}</td>
            <td>${n.fecha}</td>
            <td><span class="badge">${n.calificacion}</span></td>
        </tr>
    `).join('');
    
    spanPromedio.textContent = promedio.toFixed(2);
    spanPromedio.style.color = color;
}
```

### 7.3. Filtros Dinámicos en Estadísticas

```javascript
// Filtro de institución actualiza aulas
selectInstitucion.addEventListener('change', async (e) => {
    const idInstitucion = e.target.value;
    
    if (idInstitucion) {
        const aulas = await fetch(`/api.php?action=getAulasPorInstitucion&id=${idInstitucion}`)
            .then(r => r.json());
        
        selectAula.innerHTML = '<option value="">Todas las aulas</option>' +
            aulas.map(a => `<option value="${a.id_aula}">${a.nombre}</option>`).join('');
        selectAula.disabled = false;
    } else {
        selectAula.innerHTML = '<option value="">Todas las aulas</option>';
        selectAula.disabled = true;
    }
    
    aplicarFiltros();
});

// Aplicar filtros actualiza todas las métricas
async function aplicarFiltros() {
    const filtros = {
        institucion: selectInstitucion.value,
        aula: selectAula.value
    };
    
    const params = new URLSearchParams(filtros).toString();
    const stats = await fetch(`/api.php?action=getEstadisticas&${params}`)
        .then(r => r.json());
    
    actualizarTarjetas(stats);
    actualizarGraficos(stats);
    actualizarTablas(stats);
}
```

### 7.4. Paginación de Tablas

```javascript
let paginaActual = 1;
let registrosPorPagina = 7;

function renderizarTabla(data) {
    const totalPaginas = Math.ceil(data.length / registrosPorPagina);
    const datosPaginados = paginar(data, registrosPorPagina, paginaActual);
    
    // Renderizar filas
    tbody.innerHTML = datosPaginados.map(renderRow).join('');
    
    // Actualizar controles
    spanPaginaActual.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

btnSiguiente.addEventListener('click', () => {
    paginaActual++;
    renderizarTabla(datosOriginales);
});

btnAnterior.addEventListener('click', () => {
    paginaActual--;
    renderizarTabla(datosOriginales);
});

selectRegistrosPorPagina.addEventListener('change', (e) => {
    registrosPorPagina = parseInt(e.target.value);
    paginaActual = 1;
    renderizarTabla(datosOriginales);
});
```

---

## 8. CONCLUSIONES TÉCNICAS

### 8.1. Logros del Proyecto

✅ **Base de Datos Normalizada:** Modelo en 3FN con integridad referencial completa

✅ **Arquitectura Escalable:** Tres capas bien definidas (Presentación, Lógica, Datos)

✅ **Consultas SQL Avanzadas:** JOIN de 3+ tablas, subconsultas, funciones agregadas

✅ **Interfaz Profesional:** Diseño moderno con UX optimizada (modales sin scroll)

✅ **Análisis de Datos:** Métricas, KPIs, gráficos interactivos, segmentación por entidades

✅ **Código Mantenible:** Separación de archivos por módulo, comentarios, convenciones

✅ **Seguridad:** Prepared statements, validaciones frontend/backend, sanitización

✅ **Funcional y Completo:** Sistema operativo con +50 registros de prueba

### 8.2. Aprendizajes Clave

**Base de Datos:**
- Importancia de la normalización para evitar redundancia
- Diseño de FK con acciones CASCADE/SET NULL según contexto
- Uso de ENUM para datos categóricos con valores fijos

**Análisis de Datos:**
- Transformación de datos crudos en información útil (KPIs)
- Visualizaciones efectivas con Chart.js
- Segmentación con filtros dinámicos

**Desarrollo Web:**
- Patrón MVC simplificado en PHP
- Comunicación asíncrona con fetch API
- Mejora progresiva (Progressive Enhancement)

### 8.3. Posibles Mejoras Futuras

1. **Autenticación:** Login de usuarios con roles (admin, profesor, alumno)
2. **Exportación:** Reportes en PDF/Excel con librerías como TCPDF o PHPSpreadsheet
3. **Gráficos Avanzados:** Series temporales con evolución de notas
4. **Notificaciones:** Alertas por email cuando un alumno desaprueba
5. **Responsive Mejorado:** Diseño mobile-first con menú hamburguesa
6. **API REST:** Endpoints estandarizados (GET /alumnos, POST /alumnos, etc.)
7. **Testing:** PHPUnit para backend, Jest para frontend

### 8.4. Aplicabilidad Real

Este sistema puede ser implementado en:
- Escuelas primarias y secundarias
- Institutos terciarios
- Academias de formación
- Centros de capacitación

Con adaptaciones mínimas (agregar carreras, planes de estudio, sistema de asistencias, etc.).

---

## 9. TECNOLOGÍAS UTILIZADAS

### 9.1. Stack Técnico

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| **Frontend** | HTML5 | — | Estructura de páginas |
| | CSS3 | — | Estilos y diseño visual |
| | JavaScript | ES6+ | Lógica del cliente |
| | Chart.js | 3.9.1 | Gráficos estadísticos |
| | Font Awesome | 6.4.0 | Iconografía |
| | SweetAlert2 | 11.x | Modales y alertas |
| **Backend** | PHP | 8.2.12 | Lógica del servidor |
| | MySQLi | Incluido | Conexión a BD |
| **Base de Datos** | MySQL | 8.0+ | Almacenamiento |
| **Servidor** | Apache | 2.4.58 | Servidor HTTP |
| | XAMPP | 8.2.12 | Entorno de desarrollo |
| **Herramientas** | MySQL Workbench | 8.0+ | Diseño del DER |
| | Visual Studio Code | 1.x | Editor de código |

### 9.2. Librerías y CDNs

```html
<!-- Chart.js para gráficos -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<!-- Font Awesome para iconos -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- SweetAlert2 para modales -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### 9.3. Requisitos del Sistema

**Servidor:**
- PHP 8.0 o superior
- MySQL 8.0 o superior
- Apache con mod_rewrite habilitado
- Extensión MySQLi habilitada

**Cliente:**
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript habilitado
- Resolución mínima: 1366x768

---

## 10. REFERENCIAS Y BIBLIOGRAFÍA

**Base de Datos:**
- Silberschatz, Abraham; Korth, Henry F.; Sudarshan, S. (2014). *Fundamentos de Bases de Datos*. McGraw-Hill.
- Date, C. J. (2004). *Introducción a los Sistemas de Bases de Datos*. Pearson Educación.
- Documentación oficial de MySQL: https://dev.mysql.com/doc/

**Análisis de Datos:**
- Few, Stephen (2012). *Show Me the Numbers: Designing Tables and Graphs to Enlighten*. Analytics Press.
- Tufte, Edward R. (2001). *The Visual Display of Quantitative Information*. Graphics Press.
- Documentación de Chart.js: https://www.chartjs.org/docs/

**Desarrollo Web:**
- Mozilla Developer Network (MDN): https://developer.mozilla.org/
- PHP Manual: https://www.php.net/manual/es/
- W3C Standards: https://www.w3.org/standards/

**Recursos Específicos:**
- SweetAlert2 Docs: https://sweetalert2.github.io/
- Font Awesome Icons: https://fontawesome.com/icons
- CSS Gradient Generator: https://cssgradient.io/

---

*Documento generado para el TP Final Integrador - Base de Datos I/II + Análisis de Datos*  
*Fecha de elaboración: Noviembre 2025*
