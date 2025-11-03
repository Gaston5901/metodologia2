# Trabajo Práctico Final Integrador
## Sistema de Gestión Académica Completa

---

**Carrera**: Tecnicatura Universitaria en Programación  
**Institución**: Universidad Tecnológica Nacional - Facultad Regional Tucumán
**Año**: Segundo Año  
**Asignaturas**:Introducción al Análisis de Datos  
**Fecha de entrega**: 15 de Noviembre de 2025  

**Autores**:
- Ituarte Gaston Abelardo - Legajo: 62.379 - DNI: 44.375.762
- Caro Gabriel - Legajo: 62089 - DNI: 45.873.225
- Zenteno Deyby - Legajo: 62.060 - DNI: 95.144.975

---

## 📋 Índice

1. [Introducción Teórica](#1-introducción-teórica)
2. [Dominio del Problema](#2-dominio-del-problema)
3. [Diseño de Base de Datos](#3-diseño-de-base-de-datos)
4. [Modelo Entidad-Relación](#4-modelo-entidad-relación)
5. [Normalización](#5-normalización)
6. [Consultas SQL](#6-consultas-sql)
7. [Implementación del Sistema](#7-implementación-del-sistema)
8. [Análisis Estadístico](#8-análisis-estadístico)
9. [Visualización de Datos](#9-visualización-de-datos)
10. [Interactividad y Filtros](#10-interactividad-y-filtros)
11. [Conclusiones](#11-conclusiones)
12. [Referencias](#12-referencias)

---

## 1. Introducción Teórica

### 1.1 Importancia de los Sistemas de Gestión de Datos

En el contexto educativo actual, la gestión eficiente de información académica es fundamental para:

- **Trazabilidad**: Seguimiento del rendimiento académico de cada estudiante
- **Toma de decisiones**: Análisis estadístico para identificar áreas de mejora
- **Eficiencia administrativa**: Automatización de procesos de carga y consulta de datos
- **Transparencia**: Acceso organizado a información de alumnos, materias y evaluaciones

Los sistemas de bases de datos relacionales permiten:
1. Almacenar grandes volúmenes de información de manera estructurada
2. Mantener la integridad referencial entre entidades relacionadas
3. Realizar consultas complejas con joins y agregaciones
4. Garantizar la consistencia de los datos mediante transacciones ACID

### 1.2 Análisis de Datos en el Contexto Educativo

El análisis de datos educativos permite:

- **Identificar patrones de rendimiento**: Detectar materias con mayor índice de desaprobación
- **Segmentación demográfica**: Analizar distribución por género, edad, institución
- **Evaluación de recursos**: Medir carga de trabajo de profesores y ocupación de aulas
- **Planificación estratégica**: Proyectar necesidades futuras basadas en tendencias

### 1.3 Tecnologías de Visualización

La visualización de datos transforma información compleja en insights accionables:

- **Gráficos estadísticos**: Representación visual de distribuciones y proporciones
- **Dashboards interactivos**: Paneles de control con múltiples métricas integradas
- **Filtros dinámicos**: Segmentación de datos según criterios del usuario

---

## 2. Dominio del Problema

### 2.1 Contexto

El sistema **Control de Alumnos y Notas** surge de la necesidad de gestionar integralmente la información académica de instituciones educativas de nivel medio/secundario.

### 2.2 Problemática Identificada

Las instituciones educativas enfrentan desafíos en:

1. **Gestión manual de datos**: Planillas Excel desconectadas, prone a errores
2. **Falta de trazabilidad**: Dificultad para seguir el historial académico de un alumno
3. **Análisis fragmentado**: Imposibilidad de obtener estadísticas globales rápidamente
4. **Ineficiencia administrativa**: Tiempo excesivo en tareas de carga y consulta

### 2.3 Solución Propuesta

Sistema web integral que permite:

- **Gestión de entidades**: CRUD completo para instituciones, profesores, aulas, materias, alumnos, pruebas y notas
- **Relaciones complejas**: Modelo que refleja la estructura real (aulas tienen materias, materias tienen profesores, alumnos rinden pruebas)
- **Análisis estadístico**: Dashboard con múltiples visualizaciones y métricas calculadas dinámicamente
- **Filtros interactivos**: Capacidad de segmentar datos por institución y aula

### 2.4 Alcance del Sistema

**Funcionalidades implementadas**:
- ✅ Gestión completa de 7 entidades principales (instituciones, profesores, aulas, materias, alumnos, pruebas, notas)
- ✅ Más de 50 registros de prueba cargados
- ✅ Validaciones de integridad referencial
- ✅ Sistema de estadísticas con múltiples gráficos
- ✅ Filtros dinámicos por institución y aula
- ✅ Interfaz responsive adaptable a dispositivos móviles

**Limitaciones conocidas**:
- Sistema monousuario (sin autenticación)
- Sin historial de cambios (auditoría)
- Sin exportación de reportes (PDF/Excel)

---

## 3. Diseño de Base de Datos

### 3.1 Arquitectura General

El sistema utiliza una base de datos relacional MySQL con 8 tablas interconectadas:

```
db_alumnoss
├── instituciones (datos de colegios)
├── profesores (docentes del sistema)
├── aulas (cursos/divisiones)
├── materias (asignaturas)
├── aula_materia (relación N:M entre aulas y materias)
├── alumnos (estudiantes registrados)
├── pruebas (evaluaciones/exámenes)
└── notas (calificaciones de alumnos en pruebas)
```

### 3.2 Estructura de Tablas

#### 3.2.1 Tabla: `instituciones`

Almacena información de los establecimientos educativos.

```sql
CREATE TABLE instituciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100)
);
```

**Atributos**:
- `id`: Identificador único (clave primaria)
- `nombre`: Nombre de la institución (NOT NULL)
- `direccion`: Domicilio físico
- `telefono`: Número de contacto
- `email`: Correo electrónico institucional

**Justificación**: Permite gestionar múltiples colegios en un mismo sistema (escalabilidad).

---

#### 3.2.2 Tabla: `profesores`

Registra los docentes del sistema.

```sql
CREATE TABLE profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20)
);
```

**Atributos clave**:
- `dni`: Documento único con restricción UNIQUE
- `nombre` y `apellido`: NOT NULL (dato obligatorio)

**Validaciones**:
- DNI único para evitar duplicados
- Email opcional (algunos profesores pueden no tener)

---

#### 3.2.3 Tabla: `aulas`

Representa cursos/divisiones (ej: "1ero A", "2do B").

```sql
CREATE TABLE aulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    grado INT,
    turno ENUM('Mañana', 'Tarde', 'Noche'),
    institucion_id INT,
    profesor_id INT,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL
);
```

**Relaciones**:
- `institucion_id` → instituciones (FK, ON DELETE CASCADE)
- `profesor_id` → profesores (FK, ON DELETE SET NULL)

**Justificación de CASCADE/SET NULL**:
- Si se elimina una institución, sus aulas también se eliminan (CASCADE)
- Si se elimina un profesor, el aula queda sin preceptor pero no se elimina (SET NULL)

---

#### 3.2.4 Tabla: `materias`

Catálogo de asignaturas disponibles.

```sql
CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);
```

**Características**:
- Tabla independiente (no tiene FK)
- Permite reutilizar materias en múltiples aulas
- Descripción opcional para detalles adicionales

---

#### 3.2.5 Tabla: `aula_materia` (Relación N:M)

Tabla intermedia que resuelve la relación muchos-a-muchos entre aulas y materias.

```sql
CREATE TABLE aula_materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aula_id INT NOT NULL,
    materia_id INT NOT NULL,
    profesor_id INT,
    FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL,
    UNIQUE KEY (aula_id, materia_id)
);
```

**Justificación**:
- Una aula puede tener múltiples materias (ej: Matemática, Lengua, Historia)
- Una materia puede dictarse en múltiples aulas
- `profesor_id`: Indica quién dicta esa materia en esa aula específica
- `UNIQUE KEY (aula_id, materia_id)`: Evita duplicar la misma materia en un aula

---

#### 3.2.6 Tabla: `alumnos`

Registro de estudiantes.

```sql
CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    edad INT,
    genero ENUM('Masculino', 'Femenino'),
    aula_id INT,
    institucion_id INT,
    FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE SET NULL,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE
);
```

**Atributos importantes**:
- `genero`: ENUM con valores predefinidos (facilita estadísticas)
- `edad`: Calculada o ingresada manualmente
- `dni`: UNIQUE para evitar duplicados

**Relaciones**:
- `aula_id`: Aula a la que pertenece (SET NULL si se elimina el aula)
- `institucion_id`: Institución de pertenencia (CASCADE)

---

#### 3.2.7 Tabla: `pruebas`

Evaluaciones/exámenes registrados.

```sql
CREATE TABLE pruebas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    aula_materia_id INT NOT NULL,
    FOREIGN KEY (aula_materia_id) REFERENCES aula_materia(id) ON DELETE CASCADE
);
```

**Justificación**:
- `aula_materia_id`: Vincula la prueba a una materia específica de un aula específica
- `fecha`: Permite análisis temporal (evolución de notas)

---

#### 3.2.8 Tabla: `notas`

Calificaciones de alumnos en pruebas.

```sql
CREATE TABLE notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    prueba_id INT NOT NULL,
    nota DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (prueba_id) REFERENCES pruebas(id) ON DELETE CASCADE,
    UNIQUE KEY (alumno_id, prueba_id)
);
```

**Restricciones**:
- `UNIQUE KEY (alumno_id, prueba_id)`: Un alumno solo puede tener una nota por prueba
- `DECIMAL(5,2)`: Permite notas como 7.50, 10.00, etc.
- Ambas FK con CASCADE: Si se elimina el alumno o la prueba, sus notas también

---

## 4. Modelo Entidad-Relación

### 4.1 Diagrama Conceptual

```
┌─────────────────┐
│  INSTITUCIONES  │
└────────┬────────┘
         │ 1
         │
         │ N
    ┌────┴──────┐
    │   AULAS   │◄─────────┐
    └────┬──────┘          │
         │ 1               │
         │                 │ N
         │ N          ┌────┴─────┐
    ┌────┴────────┐   │ ALUMNOS  │
    │ AULA_MATERIA│   └────┬─────┘
    └────┬────────┘        │ 1
         │ N               │
         │            ┌────┴─────┐
    ┌────┴──────┐     │   NOTAS  │
    │  MATERIAS │     └────┬─────┘
    └───────────┘          │ N
                           │
                      ┌────┴─────┐
                      │  PRUEBAS │
                      └──────────┘

         ┌────────────┐
         │ PROFESORES │
         └──────┬─────┘
                │
                └──► (asignado a aulas y aula_materia)
```

### 4.2 Cardinalidades

| Relación | Cardinalidad | Descripción |
|----------|-------------|-------------|
| Instituciones → Aulas | 1:N | Una institución tiene muchas aulas |
| Aulas → Alumnos | 1:N | Un aula tiene muchos alumnos |
| Aulas ↔ Materias | N:M | Relación resuelta con aula_materia |
| Alumnos → Notas | 1:N | Un alumno tiene muchas notas |
| Pruebas → Notas | 1:N | Una prueba tiene muchas notas |
| Profesores → Aulas | 1:N | Un profesor puede ser preceptor de varias aulas |
| Profesores → Aula_Materia | 1:N | Un profesor dicta varias materias |

### 4.3 Dependencias

**Entidades independientes** (no tienen FK obligatorias):
- Instituciones
- Profesores
- Materias

**Entidades dependientes**:
- Aulas (depende de instituciones)
- Alumnos (depende de aulas e instituciones)
- Aula_Materia (depende de aulas y materias)
- Pruebas (depende de aula_materia)
- Notas (depende de alumnos y pruebas)

---

## 5. Normalización

### 5.1 Primera Forma Normal (1FN)

**Requisitos**:
- ✅ Todos los atributos son atómicos (no hay listas o arrays)
- ✅ Cada tabla tiene clave primaria
- ✅ No hay grupos repetidos

**Ejemplo**: 
```
❌ INCORRECTO:
alumnos: id, nombre, materias_cursadas

✅ CORRECTO:
alumnos: id, nombre
aula_materia: id, aula_id, materia_id
```

### 5.2 Segunda Forma Normal (2FN)

**Requisitos**:
- ✅ Está en 1FN
- ✅ Todos los atributos no clave dependen completamente de la clave primaria

**Ejemplo**:
```
❌ INCORRECTO:
notas: alumno_id, prueba_id, nota, nombre_alumno, nombre_prueba

✅ CORRECTO:
notas: id, alumno_id, prueba_id, nota
alumnos: id, nombre, apellido
pruebas: id, nombre
```

El nombre del alumno depende solo de `alumno_id`, no de toda la clave compuesta `(alumno_id, prueba_id)`.

### 5.3 Tercera Forma Normal (3FN)

**Requisitos**:
- ✅ Está en 2FN
- ✅ No hay dependencias transitivas

**Ejemplo**:
```
❌ INCORRECTO:
alumnos: id, nombre, aula_id, nombre_aula, institucion_id, nombre_institucion

✅ CORRECTO:
alumnos: id, nombre, aula_id, institucion_id
aulas: id, nombre, institucion_id
instituciones: id, nombre
```

El nombre del aula depende de `aula_id`, no directamente de `alumno_id`.

### 5.4 Verificación de Normalización

Todas las tablas del sistema están en **3FN**:

| Tabla | 1FN | 2FN | 3FN | Justificación |
|-------|-----|-----|-----|---------------|
| instituciones | ✅ | ✅ | ✅ | Sin dependencias transitivas |
| profesores | ✅ | ✅ | ✅ | Atributos atómicos, PK simple |
| aulas | ✅ | ✅ | ✅ | FKs correctamente separadas |
| materias | ✅ | ✅ | ✅ | Tabla simple, solo catálogo |
| aula_materia | ✅ | ✅ | ✅ | Resuelve N:M correctamente |
| alumnos | ✅ | ✅ | ✅ | Sin redundancia de datos |
| pruebas | ✅ | ✅ | ✅ | FK a aula_materia (no redundante) |
| notas | ✅ | ✅ | ✅ | Solo guarda el valor, no datos derivados |

---

## 6. Consultas SQL

### 6.1 Consulta Principal del Sistema

La consulta más compleja del sistema obtiene **todos los datos relacionados** en una sola ejecución:

```sql
SELECT 
    -- Instituciones
    i.id AS inst_id, i.nombre AS inst_nombre,
    
    -- Profesores
    p.id AS prof_id, p.nombre AS prof_nombre, p.apellido AS prof_apellido,
    
    -- Aulas
    au.id AS aula_id, au.nombre AS aula_nombre, au.grado, au.turno,
    
    -- Materias
    m.id AS mat_id, m.nombre AS mat_nombre,
    
    -- Alumnos
    al.id AS alumno_id, al.nombre AS alumno_nombre, al.apellido AS alumno_apellido,
    al.dni, al.edad, al.genero,
    
    -- Pruebas
    pr.id AS prueba_id, pr.nombre AS prueba_nombre, pr.fecha,
    
    -- Notas
    n.id AS nota_id, n.nota
    
FROM instituciones i
LEFT JOIN aulas au ON i.id = au.institucion_id
LEFT JOIN profesores p ON au.profesor_id = p.id
LEFT JOIN alumnos al ON au.id = al.aula_id
LEFT JOIN aula_materia am ON au.id = am.aula_id
LEFT JOIN materias m ON am.materia_id = m.id
LEFT JOIN pruebas pr ON am.id = pr.aula_materia_id
LEFT JOIN notas n ON al.id = n.alumno_id AND pr.id = n.prueba_id
ORDER BY i.nombre, au.nombre, al.apellido;
```

**Análisis**:
- **7 LEFT JOIN**: Garantiza que se muestren todas las instituciones incluso sin datos relacionados
- **JOIN condicional en notas**: `n.alumno_id = al.id AND n.prueba_id = pr.id` asegura la correspondencia correcta
- **Alias descriptivos**: Evita ambigüedad en columnas con mismo nombre
- **ORDER BY anidado**: Ordena por institución → aula → alumno

**Resultado**: Dataset completo utilizado por el frontend para todas las operaciones.

### 6.2 Consultas Estadísticas Clave

#### 6.2.1 Promedio General de Notas

```sql
SELECT 
    COUNT(n.id) AS total_notas,
    ROUND(AVG(n.nota), 2) AS promedio,
    COUNT(CASE WHEN n.nota >= 6 THEN 1 END) AS aprobados,
    COUNT(CASE WHEN n.nota < 6 THEN 1 END) AS desaprobados,
    ROUND((COUNT(CASE WHEN n.nota >= 6 THEN 1 END) * 100.0 / COUNT(n.id)), 2) AS porcentaje_aprobacion
FROM notas n;
```

**Técnicas utilizadas**:
- `COUNT(CASE WHEN ... THEN 1 END)`: Conteo condicional
- `ROUND(AVG(...), 2)`: Promedio redondeado a 2 decimales
- Cálculo de porcentaje con `* 100.0` para forzar decimal

**Uso en el sistema**: Panel "Rendimiento Académico General"

#### 6.2.2 Distribución por Género

```sql
SELECT 
    genero,
    COUNT(*) AS cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM alumnos)), 2) AS porcentaje
FROM alumnos
GROUP BY genero;
```

**Técnicas**:
- Subconsulta para obtener total global
- `GROUP BY` para agrupar por género
- Cálculo de porcentaje relativo

**Uso en el sistema**: Gráfico de dona + leyenda con porcentajes

#### 6.2.3 Estadísticas por Aula

```sql
SELECT 
    au.nombre AS aula,
    COUNT(DISTINCT a.id) AS total_alumnos,
    COUNT(DISTINCT CASE WHEN a.genero = 'Masculino' THEN a.id END) AS masculinos,
    COUNT(DISTINCT CASE WHEN a.genero = 'Femenino' THEN a.id END) AS femeninos,
    ROUND(AVG(a.edad), 1) AS edad_promedio,
    ROUND(AVG(n.nota), 2) AS promedio_notas
FROM aulas au
LEFT JOIN alumnos a ON au.id = a.aula_id
LEFT JOIN notas n ON a.id = n.alumno_id
GROUP BY au.id, au.nombre
HAVING COUNT(DISTINCT a.id) > 0
ORDER BY au.nombre;
```

**Técnicas avanzadas**:
- `COUNT(DISTINCT ...)`: Evita duplicados al contar alumnos
- `COUNT(DISTINCT CASE WHEN ...)`: Conteo condicional sin duplicados
- `HAVING`: Filtra después del GROUP BY (solo aulas con alumnos)

**Uso en el sistema**: Tabla "Estadísticas por Aula"

### 6.3 Consultas de Mantenimiento

#### 6.3.1 Inserción de Alumno

```sql
INSERT INTO alumnos (nombre, apellido, dni, edad, genero, aula_id, institucion_id)
VALUES ('Juan', 'Pérez', '40123456', 15, 'Masculino', 1, 1);
```

#### 6.3.2 Actualización de Nota

```sql
UPDATE notas
SET nota = 8.5
WHERE alumno_id = 1 AND prueba_id = 5;
```

#### 6.3.3 Eliminación con Cascada

```sql
DELETE FROM instituciones WHERE id = 1;
-- Se eliminan automáticamente:
-- - Aulas de esa institución (CASCADE)
-- - Alumnos de esas aulas (CASCADE)
-- - Notas de esos alumnos (CASCADE)
```

**Justificación del CASCADE**: Garantiza integridad referencial al eliminar datos huérfanos.

---

## 7. Implementación del Sistema

### 7.1 Arquitectura de Tres Capas

```
┌─────────────────────────────────────┐
│   Capa de Presentación (Frontend)  │
│   HTML5 + CSS3 + JavaScript ES6+   │
│   - index.html (dashboard)          │
│   - alumnos.html (gestión)          │
│   - estadisticas.html (análisis)    │
└──────────────┬──────────────────────┘
               │ fetch() / AJAX
┌──────────────┴──────────────────────┐
│   Capa de Lógica (Backend)         │
│   PHP 8.2.12 + MySQLi              │
│   - api.php (router de acciones)    │
│   - Prepared statements             │
└──────────────┬──────────────────────┘
               │ SQL queries
┌──────────────┴──────────────────────┐
│   Capa de Datos (Database)         │
│   MySQL 5.7+ (via XAMPP)           │
│   - db_alumnoss (base de datos)     │
│   - 8 tablas normalizadas           │
└─────────────────────────────────────┘
```

### 7.2 Tecnologías Utilizadas

| Componente | Tecnología | Versión | Propósito |
|------------|-----------|---------|-----------|
| Frontend | HTML5 | - | Estructura semántica |
| Estilos | CSS3 | - | Diseño responsive con Grid/Flexbox |
| Scripts | JavaScript | ES6+ | Lógica del cliente, fetch API |
| Gráficos | Chart.js | 4.4.0 | Visualización de datos |
| Alertas | SweetAlert2 | 11.x | Modales elegantes |
| Iconos | Font Awesome | 6.4.0 | Iconografía |
| Backend | PHP | 8.2.12 | Lógica del servidor |
| Database | MySQL | 5.7+ | Persistencia de datos |
| Servidor | Apache | 2.4.58 | Web server (via XAMPP) |

### 7.3 Flujo de Datos

#### 7.3.1 Consulta de Datos (GET)

```
Usuario hace clic → JavaScript (fetch) → api.php?action=get_all 
→ MySQL query → JSON response → JavaScript procesa → Renderiza HTML
```

**Ejemplo de código JavaScript**:
```javascript
async function loadData() {
    const response = await fetch('api.php?action=get_all');
    const data = await response.json();
    renderTable(data.alumnos);
}
```

**Ejemplo de código PHP**:
```php
case 'get_all':
    $query = "SELECT * FROM alumnos ORDER BY apellido";
    $result = $conn->query($query);
    $alumnos = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['alumnos' => $alumnos]);
    break;
```

#### 7.3.2 Creación de Registro (POST)

```
Usuario completa form → Submit → JavaScript valida → fetch POST 
→ api.php?action=add_alumno → INSERT SQL → JSON success/error 
→ SweetAlert2 muestra resultado → Recarga tabla
```

### 7.4 Validaciones Implementadas

**Frontend (JavaScript)**:
- ✅ Campos requeridos no vacíos
- ✅ DNI formato numérico (8 dígitos)
- ✅ Email formato válido (regex)
- ✅ Edad entre 10 y 25 años
- ✅ Nota entre 1 y 10

**Backend (PHP)**:
- ✅ `mysqli_real_escape_string()` para prevenir SQL injection
- ✅ Validación de datos antes de INSERT/UPDATE
- ✅ Manejo de errores con try-catch
- ✅ Response JSON siempre estructurado

---

## 8. Análisis Estadístico

### 8.1 Métricas Implementadas

El sistema calcula dinámicamente las siguientes métricas:

| Métrica | Cálculo | Fuente de Datos |
|---------|---------|-----------------|
| Total Alumnos | `COUNT(DISTINCT alumnos.id)` | Tabla alumnos filtrada |
| Total Aulas | `COUNT(DISTINCT aulas.id)` | Tabla aulas filtrada |
| Total Profesores | `COUNT(DISTINCT profesores.id)` | Tabla profesores |
| Total Materias | `COUNT(DISTINCT materias.id)` | Tabla materias |
| Promedio General | `AVG(notas.nota)` | Tabla notas filtrada |
| Aprobados | `COUNT(nota >= 6)` | Notas con nota ≥ 6 |
| Desaprobados | `COUNT(nota < 6)` | Notas con nota < 6 |
| % Masculino | `(COUNT(genero='M') / COUNT(*)) * 100` | Alumnos filtrados |
| % Femenino | `(COUNT(genero='F') / COUNT(*)) * 100` | Alumnos filtrados |

### 8.2 Algoritmo de Cálculo (JavaScript)

```javascript
function computeScope(instId, aulaId) {
    let filteredAlumnos = allData.alumnos;
    
    // Filtrar por institución
    if (instId) {
        filteredAlumnos = filteredAlumnos.filter(a => a.institucion_id == instId);
    }
    
    // Filtrar por aula
    if (aulaId) {
        filteredAlumnos = filteredAlumnos.filter(a => a.aula_id == aulaId);
    }
    
    // Obtener IDs de alumnos filtrados
    const alumnoIds = filteredAlumnos.map(a => a.id);
    
    // Filtrar notas correspondientes
    const filteredNotas = allData.notas.filter(n => alumnoIds.includes(n.alumno_id));
    
    // Calcular promedio
    const sum = filteredNotas.reduce((acc, n) => acc + parseFloat(n.nota), 0);
    const promedio = filteredNotas.length > 0 ? sum / filteredNotas.length : 0;
    
    return {
        alumnos: filteredAlumnos,
        notas: filteredNotas,
        promedio: promedio.toFixed(2)
    };
}
```

### 8.3 Interpretación de Resultados

**Ejemplo de análisis real del sistema**:

```
Datos globales (sin filtros):
- Total alumnos: 63
- Promedio general: 7.23
- Tasa de aprobación: 75.4%
- Distribución género: 55.6% F / 44.4% M
```

**Conclusiones**:
1. El promedio general (7.23) está por encima de la nota de aprobación (6.0) ✅
2. Existe una mayoría femenina en el sistema (55.6%)
3. La tasa de desaprobación (24.6%) sugiere necesidad de refuerzos en ciertas materias

**Al aplicar filtro (Institución: "Instituto San José")**:
```
- Total alumnos: 35
- Promedio: 7.50 (+0.27 vs global)
- Tasa de aprobación: 82.3%
```

**Interpretación**: El Instituto San José tiene mejor rendimiento que el promedio general.

---

## 9. Visualización de Datos

### 9.1 Tipos de Gráficos Implementados

#### 9.1.1 Gráfico de Dona (Distribución por Género)

**Biblioteca**: Chart.js (tipo `doughnut`)

**Código de implementación**:
```javascript
const ctx = document.getElementById('genderChart').getContext('2d');
genderChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Femenino', 'Masculino'],
        datasets: [{
            data: [cantidadF, cantidadM],
            backgroundColor: ['#ec4899', '#3b82f6'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    }
});
```

**Interpretación**:
- **Color rosa (#ec4899)**: Representa alumnos femeninos
- **Color azul (#3b82f6)**: Representa alumnos masculinos
- **Porcentaje**: Calculado dinámicamente y mostrado en leyenda inferior
- **Datos**: Actualizados según filtros aplicados

**Ejemplo visual**:
```
     ╱──────╲
   ╱          ╲
  │  F: 55.6%  │ 🔴 Rosa
  │  M: 44.4%  │ 🔵 Azul
   ╲          ╱
     ╲──────╱
```

**Análisis**: Permite identificar rápidamente el balance de género en la población estudiantil.

---

#### 9.1.2 Barra de Progreso (Rendimiento Académico)

**Implementación**: CSS con cálculo JavaScript

**Código HTML/CSS**:
```html
<div class="progress">
    <div class="progress-bar" style="width: 72.3%"></div>
</div>
```

```css
.progress {
    width: 100%;
    height: 12px;
    background: #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.5s ease;
}
```

**Cálculo del porcentaje**:
```javascript
const promedio = 7.23; // Promedio de notas
const maxNota = 10;
const porcentaje = (promedio / maxNota) * 100; // 72.3%
```

**Interpretación visual**:
- **0-59%**: Rojo (rendimiento bajo)
- **60-74%**: Naranja (rendimiento medio)
- **75-84%**: Azul (rendimiento bueno) ← Caso actual
- **85-100%**: Verde (rendimiento excelente)

**Análisis**: La barra llena al 72.3% indica que el promedio es 7.23/10, un rendimiento satisfactorio.

---

### 9.2 Paleta de Colores del Sistema

**Tarjetas de métricas** (gradientes):
```css
/* Instituciones */
.mc-inst { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

/* Aulas */
.mc-aula { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

/* Profesores */
.mc-prof { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

/* Materias */
.mc-mat { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

/* Alumnos */
.mc-alum { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
```

**Justificación**:
- **Alto contraste**: Texto blanco sobre gradientes oscuros (accesibilidad)
- **Diferenciación**: Cada métrica tiene su propio color para rápida identificación
- **Modernidad**: Gradientes en tendencia de diseño web 2024-2025

---

### 9.3 Tablas Interactivas

#### 9.3.1 Tabla de Estadísticas por Aula

**Columnas**:
1. **Aula**: Nombre del curso (ej: "1ero A")
2. **Total**: Cantidad de alumnos
3. **♂ / ♀**: Distribución de género (M / F)
4. **Edad prom.**: Promedio de edad redondeado a 1 decimal
5. **Promedio**: Promedio de notas redondeado a 2 decimales

**Ejemplo de fila**:
```
+--------+-------+--------+----------+----------+
| Aula   | Total | ♂ / ♀  | Edad prom| Promedio |
+--------+-------+--------+----------+----------+
| 1ero A | 18    | 8 / 10 | 15.3     | 7.50     |
+--------+-------+--------+----------+----------+
```

**Análisis posible**:
- Aulas con promedios bajos necesitan refuerzos
- Comparación de rendimiento entre cursos
- Identificación de aulas con desbalance de género

#### 9.3.2 Tabla de Estadísticas por Materia

**Columnas**:
1. **Materia**: Nombre de la asignatura
2. **Profesor**: Docente asignado
3. **Evaluaciones**: Cantidad de pruebas/exámenes
4. **Promedio**: Promedio de notas de esa materia
5. **Aprobados**: Cantidad de aprobados (nota ≥ 6)
6. **Desaprobados**: Cantidad de desaprobados (nota < 6)

**Ejemplo de análisis**:
```
+----------+----------+--------------+----------+-----------+--------------+
| Materia  | Profesor | Evaluaciones | Promedio | Aprobados | Desaprobados |
+----------+----------+--------------+----------+-----------+--------------+
| Física   | López, M | 22           | 6.20     | 15        | 7            |
+----------+----------+--------------+----------+-----------+--------------+
```

**Conclusión**: Física tiene el promedio más bajo (6.20) con 31.8% de desaprobación → Requiere intervención pedagógica.

---

### 9.4 Sistema de Paginación

**Implementación**:
```javascript
const perPage = 7; // Registros por página
const currentPage = 1; // Página actual

function renderTable(data) {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageData = data.slice(start, end);
    
    // Renderizar solo los registros de la página actual
    pageData.forEach(row => {
        // ... crear fila HTML
    });
    
    // Actualizar controles de navegación
    updatePagination(data.length, currentPage, perPage);
}
```

**Controles**:
- **Selector de cantidad**: 7 / 10 / 20 registros por página
- **Botón Anterior**: Navega a página previa (deshabilitado en página 1)
- **Indicador**: "Página 1 de 3"
- **Botón Siguiente**: Navega a página siguiente (deshabilitado en última página)

**Diseño de botones**:
```css
.nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.nav-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
}
```

---

## 10. Interactividad y Filtros

### 10.1 Sistema de Filtros Dinámicos

**Componentes**:
1. **Select de Institución**: Filtra todos los datos por colegio
2. **Select de Aula**: Filtra por curso (dependiente del filtro de institución)
3. **Botón Limpiar**: Resetea ambos filtros

**Código de implementación**:
```javascript
function onFilterChange() {
    const instId = document.getElementById('filterInst').value;
    const aulaId = document.getElementById('filterAula').value;
    
    // Recalcular datos con filtros aplicados
    const scope = computeScope(instId, aulaId);
    
    // Actualizar todas las visualizaciones
    renderMetrics(scope);
    renderPerformance(scope);
    renderGender(scope);
    renderTableAulas(scope);
    renderTableMaterias(scope);
}
```

**Flujo de filtrado**:
```
Usuario selecciona institución → Select de aulas se actualiza (solo aulas de esa institución)
→ Usuario selecciona aula → Todas las métricas se recalculan → Gráficos se actualizan
→ Tablas se filtran
```

### 10.2 Filtrado Dependiente (Institución → Aula)

**Lógica**:
```javascript
function updateAulaSelect(instId) {
    const aulaSelect = document.getElementById('filterAula');
    aulaSelect.innerHTML = '<option value="">Todas las aulas</option>';
    
    if (!instId) {
        // Si no hay institución, mostrar todas las aulas
        allData.aulas.forEach(aula => {
            const opt = document.createElement('option');
            opt.value = aula.id;
            opt.textContent = aula.nombre;
            aulaSelect.appendChild(opt);
        });
    } else {
        // Filtrar solo aulas de la institución seleccionada
        const aulasFiltered = allData.aulas.filter(a => a.institucion_id == instId);
        aulasFiltered.forEach(aula => {
            const opt = document.createElement('option');
            opt.value = aula.id;
            opt.textContent = aula.nombre;
            aulaSelect.appendChild(opt);
        });
    }
}
```

**Beneficio**: El usuario solo ve aulas relevantes para la institución elegida, mejorando la UX.

### 10.3 Botón Limpiar Filtros

**Código**:
```javascript
document.getElementById('btnClearFilters').addEventListener('click', () => {
    document.getElementById('filterInst').value = '';
    document.getElementById('filterAula').value = '';
    onFilterChange(); // Recalcula con datos globales
});
```

**Efecto**: Restaura la vista completa sin filtros aplicados.

---

### 10.4 Modales Interactivos

**SweetAlert2** para operaciones CRUD:

**Crear alumno**:
```javascript
Swal.fire({
    title: 'Nuevo Alumno',
    html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre">
        <input id="swal-apellido" class="swal2-input" placeholder="Apellido">
        <input id="swal-dni" class="swal2-input" placeholder="DNI">
    `,
    confirmButtonText: 'Guardar',
    preConfirm: () => {
        return {
            nombre: document.getElementById('swal-nombre').value,
            apellido: document.getElementById('swal-apellido').value,
            dni: document.getElementById('swal-dni').value
        };
    }
}).then((result) => {
    if (result.isConfirmed) {
        // Enviar datos a api.php
        saveAlumno(result.value);
    }
});
```

**Confirmar eliminación**:
```javascript
Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
}).then((result) => {
    if (result.isConfirmed) {
        deleteAlumno(id);
    }
});
```

---

## 11. Conclusiones

### 11.1 Objetivos Alcanzados

✅ **Base de datos normalizada (3FN)**: Estructura sin redundancias, con integridad referencial  
✅ **Sistema CRUD completo**: Gestión de 7 entidades principales  
✅ **Más de 50 registros**: Base de datos poblada con datos realistas  
✅ **2+ tipos de gráficos**: Gráfico de dona + barra de progreso + tablas estadísticas  
✅ **Filtros interactivos**: Sistema de filtrado por institución y aula  
✅ **Interfaz responsive**: Adaptable a móviles y tablets  
✅ **Documentación completa**: README, instalación, consultas SQL, documento técnico  

### 11.2 Aprendizajes Clave

**Diseño de bases de datos**:
- Importancia de normalizar para evitar anomalías de actualización
- Uso correcto de claves foráneas con ON DELETE CASCADE/SET NULL
- Resolución de relaciones N:M con tablas intermedias

**Desarrollo web**:
- Arquitectura de tres capas (Presentación, Lógica, Datos)
- Uso de fetch API para comunicación asíncrona
- Validación en frontend y backend para seguridad

**Análisis de datos**:
- Agregaciones SQL (COUNT, AVG, SUM) para métricas
- Filtrado dinámico con JavaScript para análisis segmentado
- Visualización efectiva con Chart.js

### 11.3 Desafíos Superados

1. **Consulta compleja con 7 JOIN**: Solución con LEFT JOIN para evitar pérdida de datos
2. **Filtrado dependiente (institución → aula)**: Implementación de actualización dinámica de selects
3. **Paginación con múltiples selectores**: Sistema flexible con 7/10/20 registros por página
4. **Cálculo de porcentajes dinámicos**: Algoritmo JavaScript para recálculo en tiempo real

### 11.4 Mejoras Futuras

**Corto plazo**:
- [ ] Sistema de autenticación (login de usuarios)
- [ ] Roles diferenciados (admin, profesor, director)
- [ ] Exportación de reportes en PDF

**Mediano plazo**:
- [ ] Gráficos adicionales (líneas de tendencia, barras comparativas)
- [ ] Dashboard personalizable (drag & drop de widgets)
- [ ] Notificaciones de bajo rendimiento

**Largo plazo**:
- [ ] Aplicación móvil nativa
- [ ] Integración con sistemas de gestión escolar existentes
- [ ] Machine Learning para predicción de rendimiento

---

## 12. Referencias

### 12.1 Bibliografía

1. **Elmasri, R. & Navathe, S.** (2015). *Fundamentals of Database Systems*. Pearson Education.
2. **Silberschatz, A., Korth, H. F., & Sudarshan, S.** (2019). *Database System Concepts*. McGraw-Hill Education.
3. **Date, C. J.** (2012). *SQL and Relational Theory*. O'Reilly Media.

### 12.2 Documentación Técnica

- **MySQL Documentation**: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
- **PHP Manual**: [https://www.php.net/manual/es/](https://www.php.net/manual/es/)
- **Chart.js Documentation**: [https://www.chartjs.org/docs/](https://www.chartjs.org/docs/)
- **MDN Web Docs**: [https://developer.mozilla.org/](https://developer.mozilla.org/)

### 12.3 Recursos Utilizados

- **XAMPP**: [https://www.apachefriends.org/](https://www.apachefriends.org/)
- **SweetAlert2**: [https://sweetalert2.github.io/](https://sweetalert2.github.io/)
- **Font Awesome**: [https://fontawesome.com/](https://fontawesome.com/)

---

## 📊 Anexos

### Anexo A: Script SQL Completo

El script completo de creación de la base de datos se encuentra en el archivo `db_alumnoss_complete.sql` en la raíz del proyecto.

### Anexo B: Capturas de Pantalla

Las capturas de pantalla del sistema funcionando se encuentran en la carpeta `docs/screenshots/`:
- `dashboard_principal.png`: Vista del dashboard con sidebar
- `alumnos_listado.png`: Tabla de alumnos
- `estadisticas_general.png`: Página de estadísticas completa
- `estadisticas_filtros.png`: Estadísticas con filtros aplicados
- `modal_crear.png`: Modal de creación de alumno
- `tabla_paginacion.png`: Sistema de paginación en acción

### Anexo C: Estructura de Archivos

```
alumnos_academico_app/
├── index.html              # Dashboard principal (único HTML en raíz)
├── api.php                 # Backend API
├── README.md               # Documentación principal
├── html/                   # Páginas HTML
│   ├── alumnos.html        # Gestión de alumnos
│   ├── pruebas.html        # Gestión de pruebas
│   └── estadisticas.html   # Página de análisis
├── css/                    # Estilos
│   └── styles_new.css      # Estilos globales
├── js/                     # Scripts JavaScript
│   ├── script.js           # Lógica del dashboard
│   ├── alumnos.js          # Lógica de alumnos
│   ├── pruebas.js          # Lógica de pruebas
│   └── estadisticas.js     # Lógica de estadísticas
├── database/               # Base de datos
│   └── db_alumnoss_complete.sql # Script de base de datos
├── scripts/                # Scripts de utilidad
│   └── preparar_entrega.ps1 # Script de empaquetado
└── docs/                   # Documentación
    ├── INSTALL.md          # Guía de instalación
    ├── CONSULTAS.md        # Documentación de SQL
    ├── DOCUMENTO_TECNICO.md # Este documento
    ├── 04_DOCUMENTO_TECNICO_IMPRIMIBLE.md
    ├── 05_CONSULTAS_SQL_IMPRIMIBLE.md
    ├── 06_GUIA_INSTALACION_IMPRIMIBLE.md
    └── screenshots/        # Capturas de pantalla
```

---

**FIN DEL DOCUMENTO TÉCNICO**

**Proyecto**: Sistema de Gestión Académica Completa  
**Institución**: Tecnicatura Universitaria en Programación  
**Año**: 2025  
**Versión**: 1.0  

---

*Este documento es parte del Trabajo Práctico Final Integrador de las materias Base de Datos I, Base de Datos II e Introducción al Análisis de Datos.*
