# DOCUMENTO TÉCNICO RESUMIDO
## Sistema de Gestión Académica - TP Final Integrador

---

## 1. INTRODUCCIÓN

Sistema web para gestión académica integral que centraliza información de alumnos, aulas, profesores, materias y evaluaciones con análisis estadístico y visualizaciones interactivas.

**Objetivos:**
- CRUD completo de entidades
- Visualización de datos con gráficos
- Análisis estadístico por institución/aula/materia
- Interfaz responsive y moderna

---

## 2. DOMINIO DEL PROBLEMA

**Entidades principales:**
- Instituciones (establecimientos educativos)
- Profesores (docentes)
- Aulas (cursos/divisiones)
- Materias (asignaturas)
- Alumnos (estudiantes)
- Pruebas (evaluaciones)
- Notas (calificaciones)

**Reglas de negocio clave:**
- Una institución tiene muchas aulas
- Un aula tiene un profesor asignado
- Un alumno pertenece a un aula
- Las aulas tienen múltiples materias (N:M)
- Las pruebas se asocian a aula y materia
- Las notas relacionan alumnos con pruebas

---

## 3. BASE DE DATOS

### 3.1. Modelo Entidad-Relación (Tablas Principales)

**instituciones:** id, nombre, dirección, teléfono, email

**profesores:** id, nombre, apellido, email, teléfono, dni

**aulas:** id, nombre, grado, turno, id_institucion (FK), id_profesor (FK)

**materias:** id, nombre, descripción

**aula_materia:** id, id_aula (FK), id_materia (FK) [tabla intermedia N:M]

**alumnos:** id, nombre, apellido, dni, edad, género, id_aula (FK)

**pruebas:** id, nombre, fecha, id_aula (FK), id_materia (FK)

**notas:** id, calificacion (1-10), id_alumno (FK), id_prueba (FK)

### 3.2. Normalización

✅ **1FN:** Atributos atómicos (nombre/apellido separados)  
✅ **2FN:** Todos los atributos dependen de la clave primaria completa  
✅ **3FN:** Sin dependencias transitivas (uso de FK en lugar de datos duplicados)

### 3.3. Claves Foráneas

- aulas → instituciones (SET NULL)
- aulas → profesores (SET NULL)
- alumnos → aulas (SET NULL)
- aula_materia → aulas/materias (CASCADE)
- pruebas → aulas/materias (CASCADE)
- notas → alumnos/pruebas (CASCADE)

---

## 4. ARQUITECTURA DEL SISTEMA

### 4.1. Capas

```
PRESENTACIÓN (Frontend)
├── HTML5 + CSS3 + JavaScript ES6+
├── Chart.js, Font Awesome, SweetAlert2
└── index.html, alumnos.html, estadisticas.html, pruebas.html

LÓGICA (Backend)
├── PHP 8.2.12
├── api.php (controlador de endpoints)
└── Validaciones y consultas SQL

DATOS (Base de Datos)
├── MySQL 8.0+
└── db_alumnoss (8 tablas normalizadas)
```

### 4.2. Estructura de Archivos

```
alumnos_academico_app/
├── index.html          (dashboard principal)
├── api.php             (backend API)
├── html/
│   ├── alumnos.html    (gestión alumnos)
│   ├── estadisticas.html (análisis y gráficos)
│   └── pruebas.html    (evaluaciones)
├── css/
│   └── styles_new.css  (estilos unificados)
├── js/
│   ├── script.js       (lógica dashboard)
│   ├── alumnos.js      (lógica alumnos)
│   ├── estadisticas.js (gráficos)
│   └── pruebas.js      (evaluaciones)
├── database/
│   └── db_alumnoss_complete.sql
└── docs/               (documentación)
```

---

## 5. FUNCIONALIDADES CLAVE

### 5.1. CRUD Completo

- **Instituciones, Profesores, Aulas, Materias, Alumnos:** Crear, listar, editar, eliminar
- **Modales optimizados** sin scroll innecesario
- **Validaciones** frontend y backend
- **Feedback visual** con SweetAlert2

### 5.2. Gestión de Notas

- Asignación de calificaciones por prueba
- Historial de notas por alumno
- Cálculo automático de promedios
- Estado de aprobación (≥6 = aprobado)

### 5.3. Estadísticas y Análisis

**KPIs (Tarjetas):**
- Total alumnos, aulas, profesores, materias
- Promedio general de notas
- Contadores aprobados/desaprobados

**Visualizaciones:**
- Gráfico de distribución por género (doughnut chart)
- Tabla de estadísticas por aula (alumnos, género, edad promedio, notas)
- Tabla de estadísticas por materia (evaluaciones, promedio, aprobados)

**Filtros Dinámicos:**
- Por institución (actualiza aulas disponibles)
- Por aula (segmenta métricas)
- Botón limpiar filtros

### 5.4. Características UX/UI

- **Sidebar responsivo** con navegación intuitiva
- **Gradientes azul-morado** (colores institucionales)
- **Paginación de tablas** (7/10/20 registros por página)
- **Gráficos interactivos** con tooltips
- **Sin recargas de página** (comunicación asíncrona)

---

## 6. CONSULTAS SQL DESTACADAS

**Listado de alumnos con relaciones:**
```sql
SELECT a.*, au.nombre AS aula, i.nombre AS institucion
FROM alumnos a
LEFT JOIN aulas au ON a.id_aula = au.id_aula
LEFT JOIN instituciones i ON au.id_institucion = i.id_institucion;
```

**Estadísticas por aula:**
```sql
SELECT 
    au.nombre AS aula,
    COUNT(a.id_alumno) AS total_alumnos,
    SUM(CASE WHEN a.genero = 'Masculino' THEN 1 ELSE 0 END) AS masculino,
    AVG(a.edad) AS edad_promedio,
    AVG(n.calificacion) AS promedio_notas
FROM aulas au
LEFT JOIN alumnos a ON au.id_aula = a.id_aula
LEFT JOIN notas n ON a.id_alumno = n.id_alumno
GROUP BY au.id_aula
HAVING COUNT(a.id_alumno) > 0;
```

---

## 7. TECNOLOGÍAS

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Frontend | HTML5, CSS3, JavaScript ES6+ | — |
| Gráficos | Chart.js | 3.9.1 |
| Iconos | Font Awesome | 6.4.0 |
| Modales | SweetAlert2 | 11.x |
| Backend | PHP | 8.2.12 |
| Base de Datos | MySQL | 8.0+ |
| Servidor | Apache (XAMPP) | 2.4.58 |

---

## 8. SEGURIDAD

- **Prepared Statements:** Prevención de SQL Injection
- **Validaciones:** Frontend (JavaScript) y Backend (PHP)
- **Sanitización:** mysqli_real_escape_string en entradas
- **Headers CORS:** Configurados para desarrollo local

Ejemplo:
```php
$stmt = $conn->prepare("SELECT * FROM alumnos WHERE id_alumno = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
```

---

## 9. LOGROS Y APRENDIZAJES

### Logros
✅ Base de datos normalizada (3FN) con integridad referencial  
✅ Consultas SQL complejas (JOIN 3+ tablas, agregaciones)  
✅ Interfaz profesional con diseño moderno  
✅ Análisis de datos con KPIs y visualizaciones  
✅ Sistema funcional con +50 registros de prueba  

### Aprendizajes
- Diseño de FK con acciones CASCADE/SET NULL
- Transformación de datos en información útil (KPIs)
- Comunicación asíncrona con fetch API
- Separación de responsabilidades (MVC simplificado)

---

## 10. MEJORAS FUTURAS

1. Sistema de autenticación con roles (admin/profesor/alumno)
2. Exportación de reportes en PDF/Excel
3. Gráficos de evolución temporal de notas
4. Notificaciones por email
5. API REST estandarizada
6. Testing automatizado (PHPUnit, Jest)

---

## 11. INSTALACIÓN RÁPIDA

1. Copiar carpeta a `C:\xampp\htdocs\`
2. Importar `database\db_alumnoss_complete.sql` en MySQL
3. Iniciar Apache y MySQL en XAMPP
4. Acceder a `http://localhost/alumnos_academico_app/`

**Requisitos:**
- PHP 8.0+, MySQL 8.0+, Apache con mod_rewrite
- Navegador moderno (Chrome 90+, Firefox 88+)

---

*Documento técnico resumido - TP Final Integrador*  
*Base de Datos + Análisis de Datos - Noviembre 2025*
