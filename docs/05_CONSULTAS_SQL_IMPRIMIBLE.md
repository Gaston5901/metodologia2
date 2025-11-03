# CONSULTAS SQL DETALLADAS
## Análisis de Datos del Sistema de Gestión Académica

---

## ÍNDICE DE CONSULTAS

1. Consultas Básicas (SELECT simples)
2. Consultas con JOIN de 2 tablas
3. Consultas con JOIN de 3+ tablas
4. Consultas con Funciones de Agregación
5. Consultas con GROUP BY y HAVING
6. Consultas con Subconsultas
7. Consultas de Actualización y Eliminación
8. Consultas Avanzadas (CASE, UNION, etc.)

---

## 1. CONSULTAS BÁSICAS

### 1.1. Listar todas las instituciones

```sql
SELECT 
    id_institucion,
    nombre,
    direccion,
    telefono,
    email
FROM instituciones
ORDER BY nombre;
```

**Propósito:** Obtener el catálogo completo de establecimientos educativos.

**Resultado esperado:**
```
| id | nombre                    | direccion           | telefono    | email                |
|----|---------------------------|---------------------|-------------|----------------------|
| 1  | Colegio San Martín        | Av. Libertador 123  | 123-456789  | info@sanmartin.edu   |
| 2  | Instituto Belgrano        | Calle 9 de Julio 45 | 987-654321  | contacto@belgrano.ar |
```

---

### 1.2. Listar todos los alumnos

```sql
SELECT 
    id_alumno,
    nombre,
    apellido,
    dni,
    edad,
    genero
FROM alumnos
ORDER BY apellido, nombre;
```

**Propósito:** Obtener el listado completo de estudiantes ordenados alfabéticamente.

**Uso:** Base para reportes de matrícula y estadísticas demográficas.

---

### 1.3. Obtener materias con descripción

```sql
SELECT 
    id_materia,
    nombre,
    descripcion
FROM materias
ORDER BY nombre;
```

**Propósito:** Catálogo de asignaturas disponibles en el sistema.

---

## 2. CONSULTAS CON JOIN DE 2 TABLAS

### 2.1. Alumnos con su aula asignada

```sql
SELECT 
    a.id_alumno,
    a.nombre,
    a.apellido,
    a.dni,
    au.nombre AS aula,
    au.grado,
    au.turno
FROM alumnos a
LEFT JOIN aulas au ON a.id_aula = au.id_aula
ORDER BY au.nombre, a.apellido;
```

**Propósito:** Ver la asignación de alumnos a cursos.

**Nota:** Se usa `LEFT JOIN` para incluir alumnos sin aula asignada (mostrarían NULL).

**Resultado esperado:**
```
| nombre | apellido | dni      | aula    | grado | turno  |
|--------|----------|----------|---------|-------|--------|
| Juan   | Pérez    | 45123456 | 1ero A  | 1     | Mañana |
| María  | González | 46234567 | 1ero A  | 1     | Mañana |
| Carlos | Rodríguez| 44987654 | 2do B   | 2     | Tarde  |
```

---

### 2.2. Aulas con su institución

```sql
SELECT 
    au.id_aula,
    au.nombre AS aula,
    au.grado,
    au.turno,
    i.nombre AS institucion,
    i.direccion
FROM aulas au
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion
ORDER BY i.nombre, au.grado, au.nombre;
```

**Propósito:** Ver la distribución de aulas por establecimiento.

**Análisis:** Permite identificar instituciones con pocas/muchas aulas.

---

### 2.3. Pruebas con su materia

```sql
SELECT 
    p.id_prueba,
    p.nombre AS prueba,
    p.fecha,
    m.nombre AS materia
FROM pruebas p
INNER JOIN materias m ON p.id_materia = m.id_materia
ORDER BY p.fecha DESC, m.nombre;
```

**Propósito:** Calendario de evaluaciones por asignatura.

**Uso:** Planificación de exámenes y detección de sobrecargas.

---

## 3. CONSULTAS CON JOIN DE 3+ TABLAS

### 3.1. Alumnos con aula e institución (3 tablas)

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
ORDER BY i.nombre, au.nombre, a.apellido;
```

**Propósito:** Vista completa de alumnos con todos sus datos de contexto.

**Uso:** Tabla principal del módulo de alumnos en el sistema.

**Resultado esperado:**
```
| nombre | apellido | dni      | edad | genero    | aula   | institucion         |
|--------|----------|----------|------|-----------|--------|---------------------|
| Juan   | Pérez    | 45123456 | 13   | Masculino | 1ero A | Colegio San Martín  |
| María  | González | 46234567 | 13   | Femenino  | 1ero A | Colegio San Martín  |
| Carlos | Rodríguez| 44987654 | 14   | Masculino | 2do B  | Instituto Belgrano  |
```

---

### 3.2. Notas completas (alumno + prueba + materia) - 4 tablas

```sql
SELECT 
    a.nombre AS alumno_nombre,
    a.apellido AS alumno_apellido,
    m.nombre AS materia,
    p.nombre AS prueba,
    p.fecha,
    n.calificacion
FROM notas n
INNER JOIN alumnos a ON n.id_alumno = a.id_alumno
INNER JOIN pruebas p ON n.id_prueba = p.id_prueba
INNER JOIN materias m ON p.id_materia = m.id_materia
ORDER BY a.apellido, a.nombre, p.fecha;
```

**Propósito:** Historial completo de calificaciones con todos los datos contextuales.

**Análisis:** Base para análisis de rendimiento académico individual y grupal.

---

### 3.3. Materias por aula con profesor (4 tablas)

```sql
SELECT 
    au.nombre AS aula,
    m.nombre AS materia,
    p.nombre AS profesor_nombre,
    p.apellido AS profesor_apellido,
    i.nombre AS institucion
FROM aula_materia am
INNER JOIN aulas au ON am.id_aula = au.id_aula
INNER JOIN materias m ON am.id_materia = m.id_materia
LEFT JOIN profesores p ON au.id_profesor = p.id_profesor
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion
ORDER BY i.nombre, au.nombre, m.nombre;
```

**Propósito:** Ver qué materias se dictan en cada aula y quién es el profesor responsable.

**Uso:** Planificación académica y asignación de recursos.

---

## 4. CONSULTAS CON FUNCIONES DE AGREGACIÓN

### 4.1. Contar alumnos por género

```sql
SELECT 
    genero,
    COUNT(*) AS cantidad
FROM alumnos
GROUP BY genero
ORDER BY cantidad DESC;
```

**Propósito:** Distribución demográfica del alumnado.

**Resultado esperado:**
```
| genero    | cantidad |
|-----------|----------|
| Masculino | 25       |
| Femenino  | 28       |
| Otro      | 2        |
```

**Análisis:** Útil para políticas de inclusión y balanceo de grupos.

---

### 4.2. Promedio de edad por aula

```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id_alumno) AS total_alumnos,
    AVG(a.edad) AS edad_promedio,
    MIN(a.edad) AS edad_minima,
    MAX(a.edad) AS edad_maxima
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
GROUP BY au.id_aula, au.nombre
HAVING COUNT(a.id_alumno) > 0
ORDER BY au.nombre;
```

**Propósito:** Análisis demográfico por curso.

**Uso:** Detectar alumnos con extraedad (edad mayor/menor al promedio esperado).

**Resultado esperado:**
```
| aula   | total_alumnos | edad_promedio | edad_minima | edad_maxima |
|--------|---------------|---------------|-------------|-------------|
| 1ero A | 18            | 12.8          | 12          | 14          |
| 2do B  | 22            | 13.5          | 13          | 15          |
| 3ero C | 20            | 14.2          | 14          | 16          |
```

---

### 4.3. Promedio de notas por alumno

```sql
SELECT 
    a.id_alumno,
    a.nombre,
    a.apellido,
    COUNT(n.id_nota) AS total_notas,
    AVG(n.calificacion) AS promedio,
    MIN(n.calificacion) AS nota_minima,
    MAX(n.calificacion) AS nota_maxima
FROM alumnos a
LEFT JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY a.id_alumno, a.nombre, a.apellido
HAVING COUNT(n.id_nota) > 0
ORDER BY promedio DESC;
```

**Propósito:** Ranking de alumnos por rendimiento académico.

**Uso:** Identificar estudiantes destacados o en riesgo académico.

**Resultado esperado:**
```
| nombre | apellido  | total_notas | promedio | nota_minima | nota_maxima |
|--------|-----------|-------------|----------|-------------|-------------|
| Ana    | Martínez  | 8           | 9.25     | 8.5         | 10.0        |
| Pedro  | López     | 7           | 7.86     | 6.0         | 9.0         |
| Lucía  | Fernández | 6           | 5.50     | 4.0         | 7.5         |
```

---

### 4.4. Cantidad de pruebas por materia

```sql
SELECT 
    m.nombre AS materia,
    COUNT(p.id_prueba) AS total_evaluaciones,
    MIN(p.fecha) AS primera_evaluacion,
    MAX(p.fecha) AS ultima_evaluacion
FROM materias m
LEFT JOIN pruebas p ON m.id_materia = p.id_materia
GROUP BY m.id_materia, m.nombre
ORDER BY total_evaluaciones DESC;
```

**Propósito:** Monitoreo de la carga evaluativa por asignatura.

**Análisis:** Detectar materias con pocas evaluaciones (falta de seguimiento) o muchas (sobrecarga).

---

## 5. CONSULTAS CON GROUP BY Y HAVING

### 5.1. Aulas con más de 15 alumnos

```sql
SELECT 
    au.nombre AS aula,
    i.nombre AS institucion,
    COUNT(a.id_alumno) AS total_alumnos
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion
GROUP BY au.id_aula, au.nombre, i.nombre
HAVING COUNT(a.id_alumno) > 15
ORDER BY total_alumnos DESC;
```

**Propósito:** Identificar aulas superpobladas que requieren división.

**Criterio:** Umbral de 15 alumnos (ajustable según política institucional).

---

### 5.2. Materias con promedio de notas bajo (< 6)

```sql
SELECT 
    m.nombre AS materia,
    COUNT(n.id_nota) AS total_notas,
    AVG(n.calificacion) AS promedio
FROM materias m
INNER JOIN pruebas p ON m.id_materia = p.id_materia
INNER JOIN notas n ON p.id_prueba = n.id_prueba
GROUP BY m.id_materia, m.nombre
HAVING AVG(n.calificacion) < 6
ORDER BY promedio ASC;
```

**Propósito:** Identificar asignaturas con bajo rendimiento general.

**Acción recomendada:** Refuerzo pedagógico, capacitación docente, revisión del programa.

**Resultado esperado:**
```
| materia      | total_notas | promedio |
|--------------|-------------|----------|
| Matemática   | 45          | 5.32     |
| Física       | 38          | 5.68     |
| Química      | 42          | 5.85     |
```

---

### 5.3. Alumnos con promedio excelente (≥ 8.5)

```sql
SELECT 
    a.nombre,
    a.apellido,
    au.nombre AS aula,
    COUNT(n.id_nota) AS evaluaciones,
    AVG(n.calificacion) AS promedio
FROM alumnos a
INNER JOIN notas n ON a.id_alumno = n.id_alumno
LEFT JOIN aulas au ON a.id_aula = au.id_aula
GROUP BY a.id_alumno, a.nombre, a.apellido, au.nombre
HAVING AVG(n.calificacion) >= 8.5
ORDER BY promedio DESC;
```

**Propósito:** Listado de alumnos destacados (cuadro de honor).

**Uso:** Reconocimientos, becas, menciones especiales.

---

## 6. CONSULTAS CON SUBCONSULTAS

### 6.1. Alumnos con promedio superior al general

```sql
SELECT 
    a.nombre,
    a.apellido,
    AVG(n.calificacion) AS promedio_alumno
FROM alumnos a
INNER JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY a.id_alumno, a.nombre, a.apellido
HAVING AVG(n.calificacion) > (
    SELECT AVG(calificacion) FROM notas
)
ORDER BY promedio_alumno DESC;
```

**Propósito:** Identificar alumnos que están por encima del rendimiento promedio del sistema.

**Análisis:** Si el promedio general es 6.8, esta consulta devuelve solo alumnos con promedio > 6.8.

---

### 6.2. Materias sin evaluaciones registradas

```sql
SELECT 
    m.id_materia,
    m.nombre,
    m.descripcion
FROM materias m
WHERE NOT EXISTS (
    SELECT 1 
    FROM pruebas p 
    WHERE p.id_materia = m.id_materia
)
ORDER BY m.nombre;
```

**Propósito:** Detectar materias que no tienen pruebas creadas.

**Acción:** Verificar si la materia está activa o requiere planificación de evaluaciones.

---

### 6.3. Aula con más alumnos

```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id_alumno) AS total_alumnos
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
GROUP BY au.id_aula, au.nombre
HAVING COUNT(a.id_alumno) = (
    SELECT MAX(total)
    FROM (
        SELECT COUNT(*) AS total
        FROM alumnos
        GROUP BY id_aula
    ) AS subconsulta
)
ORDER BY au.nombre;
```

**Propósito:** Identificar el curso con mayor matrícula.

**Uso:** Planificación de recursos (aulas más grandes, más docentes de apoyo).

---

### 6.4. Alumnos que desaprobaron al menos una materia

```sql
SELECT DISTINCT
    a.id_alumno,
    a.nombre,
    a.apellido,
    au.nombre AS aula
FROM alumnos a
INNER JOIN notas n ON a.id_alumno = n.id_alumno
LEFT JOIN aulas au ON a.id_aula = au.id_aula
WHERE n.id_alumno IN (
    SELECT id_alumno
    FROM notas
    WHERE calificacion < 6
)
ORDER BY au.nombre, a.apellido;
```

**Propósito:** Identificar alumnos en riesgo académico.

**Acción:** Tutorías, programas de apoyo, seguimiento personalizado.

---

## 7. CONSULTAS DE ACTUALIZACIÓN Y ELIMINACIÓN

### 7.1. Actualizar teléfono de una institución

```sql
UPDATE instituciones
SET telefono = '011-4567-8900',
    email = 'nuevo_contacto@institucion.edu'
WHERE id_institucion = 1;
```

**Propósito:** Modificar datos de contacto de un establecimiento.

**Precaución:** Verificar `id_institucion` antes de ejecutar.

---

### 7.2. Cambiar aula de un alumno

```sql
UPDATE alumnos
SET id_aula = 5
WHERE id_alumno = 12;
```

**Propósito:** Reasignar alumno a otro curso.

**Validación previa:**
```sql
-- Verificar que el aula destino exista
SELECT * FROM aulas WHERE id_aula = 5;
```

---

### 7.3. Eliminar notas de una prueba

```sql
DELETE FROM notas
WHERE id_prueba = 8;
```

**Propósito:** Eliminar calificaciones de una evaluación (útil si se cancela el examen).

**Precaución:** Esta acción es irreversible. Considerar hacer backup antes.

---

### 7.4. Eliminar alumno (con CASCADE)

```sql
DELETE FROM alumnos
WHERE id_alumno = 20;
```

**Propósito:** Dar de baja a un alumno del sistema.

**Efecto:** Por la FK con `ON DELETE CASCADE`, también se eliminarán automáticamente todas sus notas.

---

## 8. CONSULTAS AVANZADAS

### 8.1. Clasificación de alumnos por rendimiento (CASE)

```sql
SELECT 
    a.id_alumno,
    a.nombre,
    a.apellido,
    AVG(n.calificacion) AS promedio,
    CASE
        WHEN AVG(n.calificacion) >= 8.5 THEN 'Excelente'
        WHEN AVG(n.calificacion) >= 7.0 THEN 'Muy Bueno'
        WHEN AVG(n.calificacion) >= 6.0 THEN 'Bueno'
        WHEN AVG(n.calificacion) >= 4.0 THEN 'Regular'
        ELSE 'Insuficiente'
    END AS clasificacion
FROM alumnos a
LEFT JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY a.id_alumno, a.nombre, a.apellido
HAVING AVG(n.calificacion) IS NOT NULL
ORDER BY promedio DESC;
```

**Propósito:** Categorizar alumnos según su rendimiento académico.

**Escalas:**
- **Excelente:** 8.5 - 10
- **Muy Bueno:** 7.0 - 8.49
- **Bueno:** 6.0 - 6.99 (aprobado)
- **Regular:** 4.0 - 5.99 (desaprobado pero recuperable)
- **Insuficiente:** < 4.0 (requiere atención urgente)

**Resultado esperado:**
```
| nombre | apellido  | promedio | clasificacion |
|--------|-----------|----------|---------------|
| Ana    | Martínez  | 9.25     | Excelente     |
| Pedro  | López     | 7.86     | Muy Bueno     |
| Juan   | Pérez     | 6.45     | Bueno         |
| Lucía  | Fernández | 5.50     | Regular       |
| Carlos | Gómez     | 3.80     | Insuficiente  |
```

---

### 8.2. Distribución de género por aula (CASE con SUM)

```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id_alumno) AS total_alumnos,
    SUM(CASE WHEN a.genero = 'Masculino' THEN 1 ELSE 0 END) AS masculino,
    SUM(CASE WHEN a.genero = 'Femenino' THEN 1 ELSE 0 END) AS femenino,
    SUM(CASE WHEN a.genero = 'Otro' THEN 1 ELSE 0 END) AS otro,
    ROUND(AVG(a.edad), 1) AS edad_promedio
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
GROUP BY au.id_aula, au.nombre
HAVING COUNT(a.id_alumno) > 0
ORDER BY au.nombre;
```

**Propósito:** Análisis demográfico completo por curso.

**Uso:** Tabla de estadísticas del módulo de análisis.

**Resultado esperado:**
```
| aula   | total | masculino | femenino | otro | edad_prom |
|--------|-------|-----------|----------|------|-----------|
| 1ero A | 18    | 9         | 9        | 0    | 12.8      |
| 2do B  | 22    | 10        | 11       | 1    | 13.5      |
| 3ero C | 20    | 12        | 8        | 0    | 14.2      |
```

---

### 8.3. Aprobados y desaprobados por materia (CASE + JOIN)

```sql
SELECT 
    m.nombre AS materia,
    COUNT(n.id_nota) AS total_evaluaciones,
    AVG(n.calificacion) AS promedio,
    SUM(CASE WHEN n.calificacion >= 6 THEN 1 ELSE 0 END) AS aprobados,
    SUM(CASE WHEN n.calificacion < 6 THEN 1 ELSE 0 END) AS desaprobados,
    ROUND(
        (SUM(CASE WHEN n.calificacion >= 6 THEN 1 ELSE 0 END) * 100.0) / COUNT(n.id_nota), 
        2
    ) AS porcentaje_aprobacion
FROM materias m
INNER JOIN pruebas p ON m.id_materia = p.id_materia
INNER JOIN notas n ON p.id_prueba = n.id_prueba
GROUP BY m.id_materia, m.nombre
ORDER BY porcentaje_aprobacion ASC;
```

**Propósito:** Tasa de aprobación por asignatura (KPI educativo clave).

**Análisis:** Materias con porcentaje < 60% requieren intervención pedagógica.

**Resultado esperado:**
```
| materia      | total | promedio | aprobados | desaprobados | porc_aprob |
|--------------|-------|----------|-----------|--------------|------------|
| Matemática   | 45    | 5.32     | 18        | 27           | 40.00      |
| Física       | 38    | 5.68     | 20        | 18           | 52.63      |
| Historia     | 42    | 7.25     | 35        | 7            | 83.33      |
| Lengua       | 50    | 7.80     | 46        | 4            | 92.00      |
```

---

### 8.4. UNION - Listado completo de personas en el sistema

```sql
SELECT 
    'Alumno' AS tipo,
    CONCAT(nombre, ' ', apellido) AS nombre_completo,
    dni,
    NULL AS especialidad
FROM alumnos
WHERE dni IS NOT NULL

UNION

SELECT 
    'Profesor' AS tipo,
    CONCAT(nombre, ' ', apellido) AS nombre_completo,
    dni,
    'Docente' AS especialidad
FROM profesores
WHERE dni IS NOT NULL

ORDER BY tipo, nombre_completo;
```

**Propósito:** Consolidar todas las personas del sistema en una sola vista.

**Uso:** Reportes administrativos, verificación de DNIs duplicados.

**Resultado esperado:**
```
| tipo     | nombre_completo    | dni      | especialidad |
|----------|-------------------|----------|--------------|
| Alumno   | Ana Martínez      | 45123456 | NULL         |
| Alumno   | Carlos Rodríguez  | 44987654 | NULL         |
| Profesor | Juan López        | 32123456 | Docente      |
| Profesor | María González    | 33234567 | Docente      |
```

---

### 8.5. Ranking de instituciones por rendimiento académico

```sql
SELECT 
    i.nombre AS institucion,
    COUNT(DISTINCT au.id_aula) AS total_aulas,
    COUNT(DISTINCT a.id_alumno) AS total_alumnos,
    COUNT(n.id_nota) AS total_evaluaciones,
    ROUND(AVG(n.calificacion), 2) AS promedio_general,
    CASE
        WHEN AVG(n.calificacion) >= 8 THEN '🥇 Excelente'
        WHEN AVG(n.calificacion) >= 7 THEN '🥈 Muy Bueno'
        WHEN AVG(n.calificacion) >= 6 THEN '🥉 Bueno'
        ELSE '⚠️ En Desarrollo'
    END AS nivel
FROM instituciones i
LEFT JOIN aulas au ON i.id_institucion = au.id_institucion
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
LEFT JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY i.id_institucion, i.nombre
HAVING COUNT(n.id_nota) > 0
ORDER BY promedio_general DESC;
```

**Propósito:** Comparar rendimiento entre diferentes establecimientos.

**Uso:** Benchmarking, identificación de buenas prácticas, asignación de recursos.

**Resultado esperado:**
```
| institucion          | aulas | alumnos | evaluaciones | promedio | nivel          |
|----------------------|-------|---------|--------------|----------|----------------|
| Colegio San Martín   | 8     | 142     | 856          | 7.85     | 🥈 Muy Bueno   |
| Instituto Belgrano   | 6     | 108     | 648          | 7.20     | 🥈 Muy Bueno   |
| Escuela Normal       | 5     | 95      | 570          | 6.45     | 🥉 Bueno       |
```

---

## 9. CONSULTAS PARA EL SISTEMA

### 9.1. Datos completos para tabla de alumnos (usado en alumnos.html)

```sql
SELECT 
    a.id_alumno,
    a.nombre,
    a.apellido,
    a.dni,
    a.edad,
    a.genero,
    COALESCE(au.nombre, 'Sin asignar') AS aula,
    COALESCE(i.nombre, 'Sin institución') AS institucion,
    a.id_aula
FROM alumnos a
LEFT JOIN aulas au ON a.id_aula = au.id_aula
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion
ORDER BY a.apellido, a.nombre;
```

**Explicación del COALESCE:** Muestra texto alternativo si el alumno no tiene aula asignada.

---

### 9.2. Estadísticas generales del sistema (usado en estadisticas.html)

```sql
-- Totales
SELECT 
    (SELECT COUNT(*) FROM alumnos) AS total_alumnos,
    (SELECT COUNT(*) FROM aulas) AS total_aulas,
    (SELECT COUNT(*) FROM profesores) AS total_profesores,
    (SELECT COUNT(*) FROM materias) AS total_materias;

-- Promedio y distribución de notas
SELECT 
    AVG(calificacion) AS promedio_general,
    SUM(CASE WHEN calificacion >= 6 THEN 1 ELSE 0 END) AS aprobados,
    SUM(CASE WHEN calificacion < 6 THEN 1 ELSE 0 END) AS desaprobados
FROM notas;

-- Distribución por género
SELECT 
    genero,
    COUNT(*) AS cantidad,
    ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM alumnos), 2) AS porcentaje
FROM alumnos
GROUP BY genero;
```

---

### 9.3. Notas de un alumno específico (modal Ver Notas)

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

**Nota:** El `?` es un placeholder para prepared statements en PHP (seguridad).

---

## 10. CONCLUSIONES SOBRE LAS CONSULTAS

### 10.1. Complejidad Implementada

✅ **Consultas básicas:** SELECT simples con filtros y ordenamiento

✅ **JOINs múltiples:** Hasta 4 tablas relacionadas (alumnos-aulas-instituciones-notas)

✅ **Funciones de agregación:** COUNT, AVG, MIN, MAX, SUM

✅ **GROUP BY con HAVING:** Filtrado de grupos agregados

✅ **Subconsultas:** Correlacionadas y no correlacionadas

✅ **CASE:** Lógica condicional para clasificaciones y conteos

✅ **UNION:** Consolidación de conjuntos de datos

---

### 10.2. Aplicaciones Reales

**Gestión Académica:**
- Seguimiento de rendimiento individual y grupal
- Identificación de alumnos en riesgo
- Planificación de tutorías y refuerzos

**Toma de Decisiones:**
- Comparación entre aulas, materias e instituciones
- Asignación de recursos según necesidades
- Políticas de mejora continua

**Reportes Administrativos:**
- Estadísticas para reuniones de padres
- Informes para supervisores educativos
- Métricas para evaluación institucional

---

### 10.3. Escalabilidad

Todas las consultas están optimizadas para:
- **Índices:** Claves primarias y foráneas indexadas automáticamente
- **Prepared Statements:** Prevención de SQL Injection
- **LEFT JOINs:** Inclusión de registros sin relaciones (opcional)
- **Filtros dinámicos:** Adaptables a diferentes vistas (por institución, aula, etc.)

---

*Documento generado para el TP Final Integrador*  
*Todas las consultas fueron probadas exitosamente en MySQL 8.0+*
