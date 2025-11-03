# Sistema de Gestión Académica Completa

## 📋 Descripción del Sistema

Sistema web integral para la gestión académica que permite administrar instituciones educativas, aulas, profesores, materias, alumnos, pruebas y calificaciones. Incluye módulos de análisis estadístico con representación gráfica de datos para facilitar la toma de decisiones basada en información.

### Características Principales

- **Gestión de Instituciones**: Administración completa de instituciones educativas con datos de contacto y ubicación
- **Gestión de Aulas**: Control de aulas por institución con asignación de profesores
- **Gestión de Profesores**: Registro de docentes con especialidades y asignación a instituciones
- **Gestión de Materias**: Catálogo de materias que pueden ser asignadas a diferentes aulas
- **Gestión de Alumnos**: Registro completo de estudiantes con datos personales y asignación a aulas
- **Gestión de Pruebas**: Creación de evaluaciones por materia y aula con ponderación configurable
- **Gestión de Notas**: Carga y seguimiento de calificaciones de alumnos
- **Estadísticas Avanzadas**: Visualización gráfica de rendimiento académico, distribución por género, estadísticas por aula y materia

## 🎯 Dominio Temático

**Control de Alumnos y Notas** - Sistema educativo integral que permite el seguimiento completo del rendimiento académico institucional.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica de las páginas
- **CSS3**: Estilos modernos con variables CSS y gradientes
- **JavaScript ES6+**: Lógica de interacción del cliente
- **Font Awesome 6.4.0**: Iconografía
- **SweetAlert2**: Notificaciones y confirmaciones elegantes
- **Chart.js**: Visualización de datos en gráficos interactivos

### Backend
- **PHP 8.2.12**: Lenguaje de servidor
- **MySQL**: Sistema de gestión de base de datos relacional
- **Apache 2.4.58**: Servidor web

### Entorno de Desarrollo
- **XAMPP**: Paquete de desarrollo local (Apache + MySQL + PHP)
- **Git**: Control de versiones

## 📊 Modelo de Datos

### Estructura de la Base de Datos

La base de datos `db_alumnoss` está diseñada siguiendo las normas de normalización hasta 3FN (Tercera Forma Normal) e incluye las siguientes tablas:

#### Tablas Principales

1. **instituciones**
   - id (PK)
   - nombre
   - direccion
   - correo
   - localidad

2. **profesores**
   - id (PK)
   - nombre
   - apellido
   - dni (UNIQUE)
   - institucion_id (FK)
   - especialidad

3. **aulas**
   - id (PK)
   - nombre
   - grado
   - institucion_id (FK)
   - profesor_id (FK)

4. **materias**
   - id (PK)
   - nombre

5. **aula_materia** (Tabla de relación N:M)
   - id (PK)
   - aula_id (FK)
   - materia_id (FK)
   - profesor_id (FK)

6. **alumnos**
   - id (PK)
   - nombre
   - apellido
   - dni (UNIQUE)
   - edad
   - genero
   - aula_id (FK)
   - institucion_id (FK)

7. **pruebas**
   - id (PK)
   - aula_materia_id (FK)
   - nombre
   - fecha
   - peso (ponderación)

8. **notas**
   - id (PK)
   - prueba_id (FK)
   - alumno_id (FK)
   - nota

### Relaciones

- Una **institución** tiene muchas **aulas** y **profesores**
- Un **aula** pertenece a una **institución** y puede tener un **profesor** asignado
- Un **aula** tiene muchas **materias** (relación N:M a través de `aula_materia`)
- Un **alumno** pertenece a un **aula** y una **institución**
- Una **prueba** está asociada a una combinación específica de **aula-materia**
- Una **nota** vincula a un **alumno** con una **prueba**

## 🚀 Requisitos Técnicos

### Requisitos de Software

- **XAMPP 8.2.12** o superior (incluye Apache, MySQL y PHP)
- **Navegador web moderno**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Git** (opcional, para clonar el repositorio)

### Requisitos de Hardware

- **Procesador**: Dual-core 2.0 GHz o superior
- **RAM**: 4 GB mínimo (8 GB recomendado)
- **Espacio en disco**: 500 MB libres
- **Resolución de pantalla**: 1366x768 o superior

## 📥 Instalación

### Paso 1: Instalar XAMPP

1. Descargar XAMPP desde [https://www.apachefriends.org](https://www.apachefriends.org)
2. Ejecutar el instalador y seguir las instrucciones
3. Instalar en la ruta predeterminada: `C:\xampp`

### Paso 2: Copiar los Archivos del Proyecto

1. Extraer el archivo comprimido del proyecto
2. Copiar la carpeta `alumnos_academico_app` en `C:\xampp\htdocs\`
3. La ruta final debe ser: `C:\xampp\htdocs\alumnos_academico_app\`

La estructura del proyecto es:

```
alumnos_academico_app/
├── index.html          (Página principal - Dashboard)
├── api.php             (Backend API)
├── README.md
├── html/               (Páginas HTML del sistema)
│   ├── alumnos.html
│   ├── pruebas.html
│   └── estadisticas.html
├── css/                (Estilos)
│   └── styles_new.css
├── js/                 (JavaScript)
│   ├── script.js
│   ├── alumnos.js
│   ├── pruebas.js
│   └── estadisticas.js
├── database/           (Base de datos)
│   └── db_alumnoss_complete.sql
├── scripts/            (Scripts de utilidad)
│   └── preparar_entrega.ps1
└── docs/               (Documentación)
```

### Paso 3: Crear la Base de Datos

1. Abrir el Panel de Control de XAMPP
2. Iniciar los servicios **Apache** y **MySQL**
3. Abrir el navegador y acceder a: `http://localhost/phpmyadmin`
4. Crear una nueva base de datos con el nombre: `db_alumnoss`
5. Seleccionar la base de datos creada
6. Ir a la pestaña **Importar**
7. Hacer clic en **Seleccionar archivo** y buscar: `database/db_alumnoss_complete.sql`
8. Hacer clic en **Continuar** para importar

### Paso 4: Verificar la Conexión

Editar el archivo `api.php` (línea 3) y verificar los datos de conexión:

```php
$mysqli = new mysqli("localhost","root","","db_alumnoss");
```

- **host**: `localhost`
- **usuario**: `root`
- **contraseña**: `` (vacío por defecto en XAMPP)
- **base de datos**: `db_alumnoss`

## ▶️ Ejecución

### Iniciar el Sistema

1. Abrir el Panel de Control de XAMPP
2. Iniciar **Apache** y **MySQL**
3. Abrir el navegador web
4. Acceder a: `http://localhost/alumnos_academico_app/`

### Navegación del Sistema

#### Página Principal (index.html)
- **Sidebar izquierdo**: Botones para crear nuevas entidades (Institución, Aula, Profesor, Materia, Alumno, Prueba, Nota)
- **Panel central**: Vista general con tarjetas de todas las entidades
- **Barra superior**: Búsqueda global y botón de refrescar

#### Módulo de Alumnos (html/alumnos.html)
- Acceso desde el botón "Ver Alumnos" en el sidebar
- Lista completa de alumnos con paginación
- Filtros por institución y aula
- Búsqueda por DNI, nombre o apellido
- Acciones: Editar, Eliminar, Ver notas

#### Módulo de Pruebas (html/pruebas.html)
- Acceso desde el botón "Ver Pruebas" en el sidebar
- Lista de pruebas con filtros por institución, aula y materia
- Acciones: Editar, Eliminar

#### Módulo de Estadísticas (html/estadisticas.html)
- Acceso desde el botón "Ver Estadísticas" en el sidebar
- **Métricas resumidas**: Cards con totales de Alumnos, Aulas, Profesores y Materias
- **Rendimiento Académico General**: Promedio general con barra de progreso, contadores de aprobados/desaprobados
- **Distribución por Género**: Gráfico de dona con leyenda de porcentajes
- **Estadísticas por Aula**: Tabla con totales, distribución de género, edad promedio y promedio de notas
- **Estadísticas por Materia**: Tabla con rendimiento por materia, profesor, aprobados y desaprobados
- **Filtros**: Por institución y aula
- **Paginación**: Selector de 7, 10 o 20 registros por página

## 📈 Funcionalidades de Análisis de Datos

### Gráficos Implementados

1. **Gráfico de Dona (Género)**
   - Muestra la distribución de alumnos por género
   - Incluye leyenda con porcentajes y cantidades
   - Interactivo: hover muestra detalles

2. **Barra de Progreso (Rendimiento)**
   - Visualiza el promedio general de notas
   - Escala de 0 a 10
   - Código de colores según el rendimiento

### Métricas Calculadas

- **Promedio General**: Calculado sobre todas las notas del ámbito filtrado
- **Aprobados/Desaprobados**: Con umbral de 6.0 puntos
- **Edad Promedio**: Por aula
- **Distribución por Género**: Porcentajes y cantidades
- **Promedio por Materia**: Rendimiento específico por asignatura
- **Porcentaje de Aprobación**: Por materia y aula

### Filtros Dinámicos

- **Por Institución**: Filtra todos los datos según la institución seleccionada
- **Por Aula**: Refina los resultados a un aula específica
- **Botón Limpiar**: Restablece todos los filtros

## 👥 Autores

**Integrante 1:**
- Nombre: Ituarte Gaston Abelardo
- DNI: 44.375.762
- Legajo: 62.379
- Email: gastonituarte100@gmail.com

**Integrante 2: 
- Nombre: Caro Gabriel
- DNI: 45.873.225
- Legajo: 62.089
- Email: carogabriel2022@gmail.com

**Integrante 3:**
- Nombre: Zenteno
- DNI: 95.144.975
- Legajo: 62.060
- Email: deybydeleon@gmail.com

## 📅 Información del Proyecto

- **Carrera**: Tecnicatura Universitaria en Programación
- **Institución**: Universidad Tecnológica Nacional - Facultad Regional Tucumán
- **Año de cursado**: Segundo año
- **Asignaturas**: Introducción al Análisis de Datos
- **Fecha de desarrollo**: Octubre - Noviembre 2025
- **Fecha de entrega**: 15 de Noviembre de 2025
- **Versión del sistema**: 1.0.0

## 📝 Notas Adicionales

### Datos de Prueba

El archivo `db_alumnoss_complete.sql` incluye más de 50 registros de ejemplo distribuidos en:
- 2 Instituciones
- 5 Aulas
- 5 Profesores
- 8 Materias
- 60+ Alumnos
- 40+ Pruebas
- 100+ Notas

### Seguridad

⚠️ **IMPORTANTE**: Este sistema está diseñado para fines educativos y de demostración. Para un entorno de producción se recomienda:
- Implementar autenticación y autorización de usuarios
- Usar prepared statements (ya implementado en `api.php`)
- Configurar contraseñas seguras para la base de datos
- Implementar validación de datos del lado del servidor
- Usar HTTPS

### Navegadores Soportados

✅ Google Chrome (recomendado)  
✅ Mozilla Firefox  
✅ Microsoft Edge  
✅ Safari  
❌ Internet Explorer (no soportado)

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verificar que MySQL esté iniciado en XAMPP
- Verificar las credenciales en `api.php`
- Verificar que la base de datos `db_alumnoss` exista

### Error: "404 Not Found"
- Verificar que los archivos estén en `C:\xampp\htdocs\alumnos_academico_app\`
- Verificar que Apache esté iniciado en XAMPP
- Acceder a la URL correcta: `http://localhost/alumnos_academico_app/`

### Los gráficos no se muestran
- Verificar la conexión a internet (Chart.js se carga desde CDN)
- Limpiar la caché del navegador (Ctrl + Shift + Delete)
- Forzar recarga (Ctrl + Shift + R)

### Las estadísticas no muestran datos
- Verificar que existan notas cargadas en la base de datos
- Verificar los filtros aplicados
- Revisar la consola del navegador (F12) para ver errores de JavaScript

## 📞 Soporte

Para consultas o problemas relacionados con este proyecto:
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario-github] (si aplica)

---

**Trabajo Práctico Final Integrador**  
**Tecnicatura Universitaria en Programación - 2025**
