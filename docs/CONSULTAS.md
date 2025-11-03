# Consultas SQL del Sistema
## Sistema de Gestión Académica Completa

---

## 📋 Índice

1. [Consultas Básicas (SELECT)](#consultas-básicas-select)
2. [Consultas con JOIN](#consultas-con-join)
3. [Consultas con Agregación](#consultas-con-agregación)
4. [Consultas Avanzadas](#consultas-avanzadas)
5. [Consultas de Estadísticas](#consultas-de-estadísticas)

---

## 1. Consultas Básicas (SELECT)

### 1.1 Listar todos los alumnos

```sql
SELECT * FROM alumnos;
```

**Descripción**: Obtiene todos los registros de la tabla alumnos con todas sus columnas.

**Uso en el sistema**: Página de listado de alumnos (alumnos.html)

---

### 1.2 Listar alumnos con datos específicos

```sql
SELECT 
    id,
    nombre,
    apellido,
    dni,
    edad,
    genero
FROM alumnos
ORDER BY apellido, nombre;
```

**Descripción**: Obtiene solo las columnas necesarias de alumnos, ordenadas alfabéticamente por apellido y nombre.

**Resultado esperado**:
```
+----+---------+-----------+-----------+------+----------+
| id | nombre  | apellido  | dni       | edad | genero   |
+----+---------+-----------+-----------+------+----------+
| 15 | Carlos  | Álvarez   | 41234567  | 16   | Masculino|
| 8  | Ana     | Benítez   | 42345678  | 15   | Femenino |
| 3  | Luis    | Fernández | 43456789  | 17   | Masculino|
+----+---------+-----------+-----------+------+----------+
```

---

### 1.3 Buscar alumno por DNI

```sql
SELECT * FROM alumnos
WHERE dni = '40123456';
```

**Descripción**: Busca un alumno específico por su DNI (Documento Nacional de Identidad).

**Uso en el sistema**: Validación de DNI único al crear/editar alumnos.

---

### 1.4 Filtrar alumnos por género

```sql
SELECT nombre, apellido, edad
FROM alumnos
WHERE genero = 'Femenino'
ORDER BY edad DESC;
```

**Descripción**: Lista todas las alumnas ordenadas de mayor a menor edad.

---

## 2. Consultas con JOIN

### 2.1 Alumnos con su aula e institución

```sql
SELECT 
    a.id,
    a.nombre,
    a.apellido,
    a.dni,
    a.edad,
    au.nombre AS aula,
    i.nombre AS institucion
FROM alumnos a
LEFT JOIN aulas au ON a.aula_id = au.id
LEFT JOIN instituciones i ON a.institucion_id = i.id
ORDER BY i.nombre, au.nombre, a.apellido;
```

**Descripción**: Combina la información de alumnos con sus aulas e instituciones correspondientes. El LEFT JOIN asegura que se muestren todos los alumnos incluso si no tienen aula asignada.

**Resultado esperado**:
```
+----+---------+-----------+-----------+------+-------------+--------------------+
| id | nombre  | apellido  | dni       | edad | aula        | institucion        |
+----+---------+-----------+-----------+------+-------------+--------------------+
| 1  | Juan    | Pérez     | 40123456  | 15   | 1ero A      | Instituto San José |
| 2  | María   | González  | 40234567  | 16   | 1ero A      | Instituto San José |
| 5  | Pedro   | Martínez  | 40567890  | 15   | 2do B       | Colegio Nacional   |
+----+---------+-----------+-----------+------+-------------+--------------------+
```

**Uso en el sistema**: Vista principal de alumnos con contexto completo.

---

### 2.2 Aulas con su profesor asignado

```sql
SELECT 
    au.id,
    au.nombre AS aula,
    au.grado,
    i.nombre AS institucion,
    CONCAT(p.apellido, ', ', p.nombre) AS profesor
FROM aulas au
LEFT JOIN instituciones i ON au.institucion_id = i.id
LEFT JOIN profesores p ON au.profesor_id = p.id
ORDER BY i.nombre, au.grado;
```

**Descripción**: Lista todas las aulas con su institución y profesor asignado. CONCAT concatena apellido y nombre del profesor.

**Resultado esperado**:
```
+----+-------------+-------+--------------------+------------------+
| id | aula        | grado | institucion        | profesor         |
+----+-------------+-------+--------------------+------------------+
| 1  | 1ero A      | 1     | Instituto San José | García, Carlos   |
| 2  | 1ero B      | 1     | Instituto San José | Rodríguez, Ana   |
| 3  | 2do A       | 2     | Colegio Nacional   | López, María     |
+----+-------------+-------+--------------------+------------------+
```

---

### 2.3 Materias por aula con profesor

```sql
SELECT 
    au.nombre AS aula,
    m.nombre AS materia,
    CONCAT(p.apellido, ', ', p.nombre) AS profesor
FROM aula_materia am
INNER JOIN aulas au ON am.aula_id = au.id
INNER JOIN materias m ON am.materia_id = m.id
LEFT JOIN profesores p ON am.profesor_id = p.id
ORDER BY au.nombre, m.nombre;
```

**Descripción**: Muestra qué materias se dictan en cada aula y quién es el profesor encargado. INNER JOIN asegura que solo se muestren combinaciones existentes.

**Resultado esperado**:
```
+--------+---------------------+------------------+
| aula   | materia             | profesor         |
+--------+---------------------+------------------+
| 1ero A | Lengua y Literatura | González, María  |
| 1ero A | Matemática          | Pérez, Juan      |
| 1ero B | Historia            | López, Carlos    |
| 2do A  | Física              | Rodríguez, Ana   |
+--------+---------------------+------------------+
```

---

### 2.4 Notas de un alumno con detalles de la prueba

```sql
SELECT 
    a.nombre AS alumno_nombre,
    a.apellido AS alumno_apellido,
    m.nombre AS materia,
    p.nombre AS prueba,
    p.fecha,
    n.nota
FROM notas n
INNER JOIN alumnos a ON n.alumno_id = a.id
INNER JOIN pruebas p ON n.prueba_id = p.id
INNER JOIN aula_materia am ON p.aula_materia_id = am.id
INNER JOIN materias m ON am.materia_id = m.id
WHERE a.id = 1
ORDER BY p.fecha DESC;
```

**Descripción**: Obtiene todas las notas de un alumno específico (ID=1) con información de la materia y prueba.

**Resultado esperado**:
```
+---------------+-----------------+----------+----------------------+------------+------+
| alumno_nombre | alumno_apellido | materia  | prueba               | fecha      | nota |
+---------------+-----------------+----------+----------------------+------------+------+
| Juan          | Pérez           | Matemática| Evaluación Integrad. | 2024-10-15 | 8.5  |
| Juan          | Pérez           | Lengua    | Trabajo Práctico 2   | 2024-09-20 | 7.0  |
| Juan          | Pérez           | Matemática| Parcial 1            | 2024-08-10 | 6.5  |
+---------------+-----------------+----------+----------------------+------------+------+
```

**Uso en el sistema**: Modal "Ver notas" en la página de alumnos.

---

## 3. Consultas con Agregación

### 3.1 Contar alumnos por institución

```sql
SELECT 
    i.nombre AS institucion,
    COUNT(a.id) AS total_alumnos
FROM instituciones i
LEFT JOIN alumnos a ON i.id = a.institucion_id
GROUP BY i.id, i.nombre
ORDER BY total_alumnos DESC;
```

**Descripción**: Cuenta cuántos alumnos tiene cada institución. GROUP BY agrupa por institución y COUNT cuenta los registros.

**Resultado esperado**:
```
+--------------------+---------------+
| institucion        | total_alumnos |
+--------------------+---------------+
| Instituto San José | 35            |
| Colegio Nacional   | 28            |
+--------------------+---------------+
```

**Uso en el sistema**: Tarjetas de estadísticas generales.

---

### 3.2 Promedio de edad por aula

```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id) AS total_alumnos,
    ROUND(AVG(a.edad), 1) AS edad_promedio,
    MIN(a.edad) AS edad_minima,
    MAX(a.edad) AS edad_maxima
FROM aulas au
LEFT JOIN alumnos a ON au.id = a.aula_id
GROUP BY au.id, au.nombre
HAVING COUNT(a.id) > 0
ORDER BY au.nombre;
```

**Descripción**: Calcula estadísticas de edad por aula. ROUND redondea a 1 decimal, HAVING filtra aulas con alumnos.

**Resultado esperado**:
```
+--------+---------------+---------------+-------------+-------------+
| aula   | total_alumnos | edad_promedio | edad_minima | edad_maxima |
+--------+---------------+---------------+-------------+-------------+
| 1ero A | 18            | 15.3          | 14          | 17          |
| 1ero B | 15            | 15.0          | 15          | 16          |
| 2do A  | 20            | 16.2          | 15          | 18          |
+--------+---------------+---------------+-------------+-------------+
```

**Uso en el sistema**: Tabla "Estadísticas por Aula" en la página de estadísticas.

---

### 3.3 Distribución de alumnos por género

```sql
SELECT 
    genero,
    COUNT(*) AS cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM alumnos)), 2) AS porcentaje
FROM alumnos
GROUP BY genero
ORDER BY cantidad DESC;
```

**Descripción**: Cuenta alumnos por género y calcula el porcentaje. La subconsulta obtiene el total para calcular el porcentaje.

**Resultado esperado**:
```
+-----------+----------+------------+
| genero    | cantidad | porcentaje |
+-----------+----------+------------+
| Femenino  | 35       | 55.56      |
| Masculino | 28       | 44.44      |
+-----------+----------+------------+
```

**Uso en el sistema**: Gráfico de dona en la página de estadísticas.

---

### 3.4 Promedio de notas general

```sql
SELECT 
    COUNT(*) AS total_notas,
    ROUND(AVG(nota), 2) AS promedio_general,
    ROUND(MAX(nota), 2) AS nota_maxima,
    ROUND(MIN(nota), 2) AS nota_minima,
    ROUND(STDDEV(nota), 2) AS desviacion_estandar
FROM notas;
```

**Descripción**: Calcula estadísticas generales sobre todas las notas. STDDEV calcula la desviación estándar.

**Resultado esperado**:
```
+-------------+------------------+-------------+-------------+---------------------+
| total_notas | promedio_general | nota_maxima | nota_minima | desviacion_estandar |
+-------------+------------------+-------------+-------------+---------------------+
| 127         | 7.23             | 10.00       | 5.00        | 1.45                |
+-------------+------------------+-------------+-------------+---------------------+
```

**Uso en el sistema**: Panel "Rendimiento Académico General".

---

## 4. Consultas Avanzadas

### 4.1 Alumnos con promedio de notas

```sql
SELECT 
    a.id,
    a.nombre,
    a.apellido,
    COUNT(n.id) AS total_evaluaciones,
    ROUND(AVG(n.nota), 2) AS promedio,
    CASE 
        WHEN AVG(n.nota) >= 6 THEN 'Aprobado'
        ELSE 'Desaprobado'
    END AS estado
FROM alumnos a
LEFT JOIN notas n ON a.id = n.alumno_id
GROUP BY a.id, a.nombre, a.apellido
HAVING COUNT(n.id) > 0
ORDER BY promedio DESC;
```

**Descripción**: Lista alumnos con su promedio y estado (aprobado/desaprobado). CASE crea una lógica condicional.

**Resultado esperado**:
```
+----+---------+-----------+--------------------+----------+--------------+
| id | nombre  | apellido  | total_evaluaciones | promedio | estado       |
+----+---------+-----------+--------------------+----------+--------------+
| 5  | Pedro   | Martínez  | 8                  | 8.75     | Aprobado     |
| 1  | Juan    | Pérez     | 10                 | 7.50     | Aprobado     |
| 12 | Laura   | Gómez     | 6                  | 5.83     | Desaprobado  |
+----+---------+-----------+--------------------+----------+--------------+
```

---

### 4.2 Materias con mayor y menor rendimiento

```sql
SELECT 
    m.nombre AS materia,
    COUNT(n.id) AS total_notas,
    ROUND(AVG(n.nota), 2) AS promedio,
    COUNT(CASE WHEN n.nota >= 6 THEN 1 END) AS aprobados,
    COUNT(CASE WHEN n.nota < 6 THEN 1 END) AS desaprobados,
    ROUND((COUNT(CASE WHEN n.nota >= 6 THEN 1 END) * 100.0 / COUNT(n.id)), 2) AS porcentaje_aprobacion
FROM materias m
INNER JOIN aula_materia am ON m.id = am.materia_id
INNER JOIN pruebas p ON am.id = p.aula_materia_id
INNER JOIN notas n ON p.id = n.prueba_id
GROUP BY m.id, m.nombre
HAVING COUNT(n.id) > 0
ORDER BY promedio DESC;
```

**Descripción**: Analiza el rendimiento por materia con tasa de aprobación. Usa COUNT con CASE para contar condicionalmente.

**Resultado esperado**:
```
+---------------------+-------------+----------+-----------+--------------+-----------------------+
| materia             | total_notas | promedio | aprobados | desaprobados | porcentaje_aprobacion |
+---------------------+-------------+----------+-----------+--------------+-----------------------+
| Lengua y Literatura | 25          | 8.10     | 23        | 2            | 92.00                 |
| Matemática          | 30          | 7.45     | 25        | 5            | 83.33                 |
| Historia            | 18          | 6.80     | 14        | 4            | 77.78                 |
| Física              | 22          | 6.20     | 15        | 7            | 68.18                 |
+---------------------+-------------+----------+-----------+--------------+-----------------------+
```

**Uso en el sistema**: Tabla "Estadísticas por Materia".

---

### 4.3 Top 10 mejores alumnos

```sql
SELECT 
    a.nombre,
    a.apellido,
    au.nombre AS aula,
    COUNT(n.id) AS evaluaciones,
    ROUND(AVG(n.nota), 2) AS promedio
FROM alumnos a
INNER JOIN notas n ON a.id = n.alumno_id
INNER JOIN aulas au ON a.aula_id = au.id
GROUP BY a.id, a.nombre, a.apellido, au.nombre
HAVING COUNT(n.id) >= 5
ORDER BY promedio DESC, evaluaciones DESC
LIMIT 10;
```

**Descripción**: Obtiene los 10 alumnos con mejor promedio (con mínimo 5 evaluaciones). LIMIT restringe los resultados.

**Resultado esperado**:
```
+---------+-----------+--------+--------------+----------+
| nombre  | apellido  | aula   | evaluaciones | promedio |
+---------+-----------+--------+--------------+----------+
| Pedro   | Martínez  | 2do B  | 8            | 8.75     |
| Ana     | Benítez   | 1ero A | 9            | 8.50     |
| Carlos  | Álvarez   | 1ero B | 7            | 8.30     |
| María   | González  | 1ero A | 10           | 8.10     |
| Luis    | Fernández | 2do A  | 6            | 7.95     |
+---------+-----------+--------+--------------+----------+
```

---

### 4.4 Alumnos sin notas cargadas

```sql
SELECT 
    a.id,
    a.nombre,
    a.apellido,
    a.dni,
    au.nombre AS aula,
    i.nombre AS institucion
FROM alumnos a
LEFT JOIN notas n ON a.id = n.alumno_id
LEFT JOIN aulas au ON a.aula_id = au.id
LEFT JOIN instituciones i ON a.institucion_id = i.id
WHERE n.id IS NULL
ORDER BY i.nombre, au.nombre, a.apellido;
```

**Descripción**: Identifica alumnos que no tienen ninguna nota registrada. WHERE n.id IS NULL detecta la ausencia de notas.

**Uso en el sistema**: Identificar alumnos que necesitan evaluaciones.

---

## 5. Consultas de Estadísticas

### 5.1 Rendimiento por género

```sql
SELECT 
    a.genero,
    COUNT(DISTINCT a.id) AS total_alumnos,
    COUNT(n.id) AS total_evaluaciones,
    ROUND(AVG(n.nota), 2) AS promedio
FROM alumnos a
LEFT JOIN notas n ON a.id = n.alumno_id
GROUP BY a.genero;
```

**Descripción**: Compara el rendimiento académico entre géneros. COUNT DISTINCT cuenta alumnos únicos.

**Resultado esperado**:
```
+-----------+---------------+---------------------+----------+
| genero    | total_alumnos | total_evaluaciones | promedio |
+-----------+---------------+---------------------+----------+
| Femenino  | 35            | 72                  | 7.45     |
| Masculino | 28            | 55                  | 7.10     |
+-----------+---------------+---------------------+----------+
```

---

### 5.2 Evolución de notas por mes

```sql
SELECT 
    DATE_FORMAT(p.fecha, '%Y-%m') AS mes,
    COUNT(n.id) AS total_evaluaciones,
    ROUND(AVG(n.nota), 2) AS promedio
FROM pruebas p
INNER JOIN notas n ON p.id = n.prueba_id
WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(p.fecha, '%Y-%m')
ORDER BY mes;
```

**Descripción**: Muestra la evolución del rendimiento en los últimos 6 meses. DATE_FORMAT formatea fechas.

**Resultado esperado**:
```
+---------+---------------------+----------+
| mes     | total_evaluaciones | promedio |
+---------+---------------------+----------+
| 2024-05 | 18                  | 7.20     |
| 2024-06 | 22                  | 7.35     |
| 2024-07 | 15                  | 7.10     |
| 2024-08 | 25                  | 7.40     |
| 2024-09 | 28                  | 7.55     |
| 2024-10 | 19                  | 7.25     |
+---------+---------------------+----------+
```

---

### 5.3 Carga de trabajo por profesor

```sql
SELECT 
    CONCAT(p.apellido, ', ', p.nombre) AS profesor,
    COUNT(DISTINCT am.id) AS materias_asignadas,
    COUNT(DISTINCT am.aula_id) AS aulas_asignadas,
    COUNT(DISTINCT pr.id) AS pruebas_creadas,
    COUNT(DISTINCT a.id) AS alumnos_a_cargo
FROM profesores p
LEFT JOIN aula_materia am ON p.id = am.profesor_id
LEFT JOIN pruebas pr ON am.id = pr.aula_materia_id
LEFT JOIN aulas au ON am.aula_id = au.id
LEFT JOIN alumnos a ON au.id = a.aula_id
GROUP BY p.id, p.apellido, p.nombre
ORDER BY materias_asignadas DESC, alumnos_a_cargo DESC;
```

**Descripción**: Analiza la carga de trabajo de cada profesor (materias, aulas, pruebas, alumnos).

**Resultado esperado**:
```
+------------------+--------------------+-----------------+-----------------+------------------+
| profesor         | materias_asignadas | aulas_asignadas | pruebas_creadas | alumnos_a_cargo |
+------------------+--------------------+-----------------+-----------------+------------------+
| García, Carlos   | 3                  | 2               | 12              | 35               |
| Rodríguez, Ana   | 2                  | 2               | 8               | 28               |
| López, María     | 1                  | 1               | 5               | 18               |
+------------------+--------------------+-----------------+-----------------+------------------+
```

---

### 5.4 Estadísticas completas por aula

```sql
SELECT 
    au.nombre AS aula,
    i.nombre AS institucion,
    COUNT(DISTINCT a.id) AS total_alumnos,
    COUNT(DISTINCT CASE WHEN a.genero = 'Masculino' THEN a.id END) AS masculinos,
    COUNT(DISTINCT CASE WHEN a.genero = 'Femenino' THEN a.id END) AS femeninos,
    ROUND(AVG(a.edad), 1) AS edad_promedio,
    COUNT(DISTINCT n.id) AS total_notas,
    ROUND(AVG(n.nota), 2) AS promedio_notas,
    COUNT(DISTINCT CASE WHEN n.nota >= 6 THEN n.alumno_id END) AS alumnos_aprobados,
    COUNT(DISTINCT CASE WHEN n.nota < 6 THEN n.alumno_id END) AS alumnos_desaprobados
FROM aulas au
LEFT JOIN instituciones i ON au.institucion_id = i.id
LEFT JOIN alumnos a ON au.id = a.aula_id
LEFT JOIN notas n ON a.id = n.alumno_id
GROUP BY au.id, au.nombre, i.nombre
HAVING COUNT(DISTINCT a.id) > 0
ORDER BY i.nombre, au.nombre;
```

**Descripción**: Reporte completo de estadísticas por aula con toda la información relevante.

**Resultado esperado**:
```
+--------+--------------------+---------------+------------+-----------+---------------+-------------+----------------+-------------------+----------------------+
| aula   | institucion        | total_alumnos | masculinos | femeninos | edad_promedio | total_notas | promedio_notas | alumnos_aprobados | alumnos_desaprobados |
+--------+--------------------+---------------+------------+-----------+---------------+-------------+----------------+-------------------+----------------------+
| 1ero A | Instituto San José | 18            | 8          | 10        | 15.3          | 42          | 7.50           | 15                | 3                    |
| 1ero B | Instituto San José | 15            | 6          | 9         | 15.0          | 35          | 7.20           | 12                | 3                    |
| 2do A  | Colegio Nacional   | 20            | 10         | 10        | 16.2          | 50          | 7.10           | 16                | 4                    |
+--------+--------------------+---------------+------------+-----------+---------------+-------------+----------------+-------------------+----------------------+
```

**Uso en el sistema**: Tabla completa "Estadísticas por Aula" en la página de estadísticas.

---

## 📝 Notas sobre Optimización

### Índices Recomendados

Para mejorar el rendimiento de estas consultas, se recomienda crear los siguientes índices:

```sql
-- Índices en claves foráneas
CREATE INDEX idx_alumnos_aula ON alumnos(aula_id);
CREATE INDEX idx_alumnos_institucion ON alumnos(institucion_id);
CREATE INDEX idx_notas_alumno ON notas(alumno_id);
CREATE INDEX idx_notas_prueba ON notas(prueba_id);
CREATE INDEX idx_pruebas_aula_materia ON pruebas(aula_materia_id);
CREATE INDEX idx_aula_materia_aula ON aula_materia(aula_id);
CREATE INDEX idx_aula_materia_materia ON aula_materia(materia_id);

-- Índices en campos de búsqueda
CREATE INDEX idx_alumnos_dni ON alumnos(dni);
CREATE INDEX idx_alumnos_genero ON alumnos(genero);
CREATE INDEX idx_pruebas_fecha ON pruebas(fecha);
```

### Justificación de JOIN vs Subconsultas

En este sistema se prefiere usar JOIN en lugar de subconsultas por:
1. **Mejor rendimiento**: MySQL optimiza mejor los JOIN
2. **Legibilidad**: Código más claro y mantenible
3. **Escalabilidad**: Más eficiente con grandes volúmenes de datos

### Uso de LEFT JOIN vs INNER JOIN

- **LEFT JOIN**: Cuando queremos mantener todos los registros de la tabla izquierda aunque no haya coincidencia (ej: alumnos sin notas)
- **INNER JOIN**: Cuando solo queremos registros con coincidencia en ambas tablas (ej: notas que sí tienen alumno y prueba asignados)

---

**Documento técnico - Trabajo Práctico Final Integrador**  
**Tecnicatura Universitaria en Programación - 2025**
