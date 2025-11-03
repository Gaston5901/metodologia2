# GUÍA DE INSTALACIÓN
## Sistema de Gestión Académica - Instrucciones Paso a Paso

---

## ÍNDICE

1. Requisitos del Sistema
2. Instalación de XAMPP
3. Configuración de la Base de Datos
4. Instalación de los Archivos del Sistema
5. Verificación de la Instalación
6. Solución de Problemas Comunes
7. Acceso al Sistema

---

## 1. REQUISITOS DEL SISTEMA

### 1.1. Requisitos de Hardware

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| Procesador | Intel Core i3 o equivalente | Intel Core i5 o superior |
| RAM | 4 GB | 8 GB o más |
| Disco Duro | 2 GB libres | 5 GB o más |
| Pantalla | 1280x720 | 1920x1080 |

### 1.2. Requisitos de Software

✅ **Sistema Operativo:**
- Windows 7/8/10/11 (64 bits)
- Linux (Ubuntu 18.04+, CentOS 7+)
- macOS 10.13+

✅ **Navegador Web:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+ (macOS)

✅ **Software necesario:**
- XAMPP 8.0+ (incluye Apache, MySQL, PHP)
- MySQL Workbench 8.0+ (opcional, para gestión visual)

---

## 2. INSTALACIÓN DE XAMPP

### 2.1. Descargar XAMPP

**Paso 1:** Ir al sitio oficial de XAMPP

```
https://www.apachefriends.org/es/index.html
```

**Paso 2:** Seleccionar la versión correspondiente a tu sistema operativo

- **Windows:** XAMPP para Windows (versión 8.2.12 recomendada)
- **Linux:** XAMPP para Linux
- **macOS:** XAMPP para OS X

**Paso 3:** Descargar el instalador (tamaño aproximado: 150-200 MB)

---

### 2.2. Instalar XAMPP en Windows

**Paso 1:** Ejecutar el instalador descargado (`xampp-windows-x64-8.2.12-0-VS16-installer.exe`)

**Paso 2:** Si aparece advertencia de Control de Cuentas de Usuario (UAC), clic en **"Sí"**

**Paso 3:** En la pantalla de bienvenida, clic en **"Next"**

**Paso 4:** Seleccionar componentes a instalar:

✅ Marcar:
- Apache
- MySQL
- PHP
- phpMyAdmin

❌ Desmarcar (opcional):
- FileZilla FTP Server
- Mercury Mail Server
- Tomcat
- Perl

**Paso 5:** Elegir carpeta de instalación (por defecto: `C:\xampp`)

⚠️ **IMPORTANTE:** Evitar carpetas con espacios o caracteres especiales.

**Paso 6:** Desmarcar la opción "Learn more about Bitnami for XAMPP" (opcional)

**Paso 7:** Clic en **"Next"** → **"Next"** → Esperar la instalación (3-5 minutos)

**Paso 8:** Al finalizar, marcar "Do you want to start the Control Panel now?" y clic en **"Finish"**

---

### 2.3. Configurar XAMPP

**Paso 1:** Abrir el Panel de Control de XAMPP (`C:\xampp\xampp-control.exe`)

**Paso 2:** Iniciar servicios necesarios:

- Clic en **"Start"** junto a **Apache** → El botón debe cambiar a color verde
- Clic en **"Start"** junto a **MySQL** → El botón debe cambiar a color verde

**Resultado esperado:**
```
Apache: Running (Puerto 80)
MySQL: Running (Puerto 3306)
```

⚠️ **Si Apache no inicia (puerto 80 ocupado):**

1. Clic en **"Config"** (botón de Apache) → **"httpd.conf"**
2. Buscar la línea `Listen 80` (Ctrl+F)
3. Cambiar por `Listen 8080`
4. Guardar y reintentar

**Paso 3:** Verificar que funciona:

- Abrir navegador
- Ir a `http://localhost`
- Debe aparecer la página de bienvenida de XAMPP

---

## 3. CONFIGURACIÓN DE LA BASE DE DATOS

### 3.1. Acceder a phpMyAdmin

**Paso 1:** Abrir navegador y ir a:

```
http://localhost/phpmyadmin
```

**Paso 2:** Credenciales de acceso:

```
Usuario: root
Contraseña: (dejar en blanco)
```

**Paso 3:** Clic en **"Iniciar sesión"** o **"Go"**

---

### 3.2. Crear la Base de Datos

**Método 1: Importar el script SQL completo (RECOMENDADO)**

**Paso 1:** En phpMyAdmin, clic en la pestaña **"SQL"** (arriba)

**Paso 2:** Copiar y pegar el contenido del archivo `db_alumnoss_complete.sql`

Archivo ubicado en:
```
C:\xampp\htdocs\alumnos_academico_app\database\db_alumnoss_complete.sql
```

**Paso 3:** Clic en **"Continuar"** o **"Go"** (abajo a la derecha)

**Paso 4:** Esperar el mensaje: **"X consultas ejecutadas correctamente"**

**Verificación:**
- En el panel izquierdo debe aparecer la base de datos **`db_alumnoss`**
- Dentro debe haber 8 tablas:
  1. `instituciones`
  2. `profesores`
  3. `aulas`
  4. `materias`
  5. `aula_materia`
  6. `alumnos`
  7. `pruebas`
  8. `notas`

---

**Método 2: Importar desde archivo**

**Paso 1:** En phpMyAdmin, clic en **"Importar"** (pestaña superior)

**Paso 2:** Clic en **"Seleccionar archivo"**

**Paso 3:** Buscar y seleccionar `database\db_alumnoss_complete.sql`

**Paso 4:** Dejar opciones por defecto:
- Formato: SQL
- Codificación: utf8

**Paso 5:** Clic en **"Continuar"** al final de la página

**Paso 6:** Esperar el mensaje de éxito

---

### 3.3. Verificar Datos de Prueba

**Paso 1:** En phpMyAdmin, clic en la base de datos **`db_alumnoss`**

**Paso 2:** Clic en la tabla **`alumnos`** → Pestaña **"Examinar"**

**Resultado esperado:**
- Deben aparecer varios registros de alumnos de prueba
- Si aparecen al menos 10 alumnos, la base de datos se instaló correctamente

**Paso 3:** Repetir para otras tablas:
- `instituciones` → Debe tener al menos 2 registros
- `profesores` → Debe tener al menos 5 registros
- `aulas` → Debe tener al menos 8 registros
- `materias` → Debe tener al menos 10 registros

---

## 4. INSTALACIÓN DE LOS ARCHIVOS DEL SISTEMA

### 4.1. Copiar Archivos al Servidor

**Paso 1:** Descomprimir el archivo ZIP del sistema (si aplica)

**Paso 2:** Copiar la carpeta completa `alumnos_academico_app` a:

```
C:\xampp\htdocs\
```

**Resultado final:**
```
alumnos_academico_app/
    ├── index.html
    ├── api.php
    ├── README.md
    ├── html/
    │   ├── alumnos.html
    │   ├── pruebas.html
    │   └── estadisticas.html
    ├── css/
    │   └── styles_new.css
    ├── js/
    │   ├── script.js
    │   ├── alumnos.js
    │   ├── pruebas.js
    │   └── estadisticas.js
    ├── database/
    │   └── db_alumnoss_complete.sql
    ├── scripts/
    │   └── preparar_entrega.ps1
    └── docs/
```

---

### 4.2. Verificar Permisos (Linux/macOS)

**Solo si estás en Linux o macOS:**

**Paso 1:** Abrir terminal

**Paso 2:** Ejecutar comandos:

```bash
cd /opt/lampp/htdocs/alumnos_academico_app
chmod -R 755 .
chown -R daemon:daemon .
```

**Explicación:**
- `chmod 755`: Da permisos de lectura/ejecución
- `chown daemon`: Asigna propietario correcto (usuario de Apache)

---

### 4.3. Configurar Conexión a Base de Datos

**Paso 1:** Abrir el archivo `api.php` con un editor de texto (Notepad++, VS Code, Sublime Text)

Ubicación:
```
C:\xampp\htdocs\alumnos_academico_app\api.php
```

**Paso 2:** Verificar la sección de conexión (primeras líneas):

```php
<?php
// Configuración de la base de datos
$host = "localhost";
$user = "root";
$pass = "";
$db = "db_alumnoss";

// Conexión a MySQL
$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");
```

**Paso 3:** Modificar si es necesario:

| Variable | Valor por defecto | Cuándo cambiar |
|----------|-------------------|----------------|
| `$host` | "localhost" | Si MySQL está en otro servidor |
| `$user` | "root" | Si creaste otro usuario MySQL |
| `$pass` | "" (vacío) | Si pusiste contraseña a root |
| `$db` | "db_alumnoss" | Si usaste otro nombre de BD |

**Paso 4:** Guardar cambios (Ctrl+S)

---

## 5. VERIFICACIÓN DE LA INSTALACIÓN

### 5.1. Verificar Apache y MySQL

**Paso 1:** Abrir el Panel de Control de XAMPP

**Paso 2:** Verificar que estén en verde:
- ✅ Apache
- ✅ MySQL

**Si no están activos:**
- Clic en **"Start"** junto a cada uno

---

### 5.2. Probar Acceso al Sistema

**Paso 1:** Abrir navegador web

**Paso 2:** Ir a la URL:

```
http://localhost/alumnos_academico_app/
```

O también:
```
http://localhost/alumnos_academico_app/index.html
```

**Resultado esperado:**
- Debe aparecer el **Dashboard Principal** del sistema
- Sidebar izquierdo con menú de navegación
- Topbar azul con gradiente
- Botones: "Nueva Institución", "Nuevo Profesor", etc.

---

### 5.3. Probar Funcionalidades

**Prueba 1: Listar Alumnos**

- Clic en **"Alumnos"** en el sidebar
- Debe aparecer una tabla con los alumnos de prueba
- Columnas: ID, Nombre, Apellido, DNI, Edad, Género, Aula, Institución

**Prueba 2: Ver Estadísticas**

- Clic en **"Estadísticas"** en el sidebar
- Deben aparecer:
  - 4 tarjetas con totales (Alumnos, Aulas, Profesores, Materias)
  - Panel de rendimiento académico con promedio
  - Gráfico de dona con distribución de género
  - 2 tablas: Estadísticas por Aula y por Materia

**Prueba 3: Crear un Alumno**

- En la página de Alumnos, clic en **"Nuevo Alumno"**
- Debe abrir un modal compacto (sin scroll)
- Llenar campos:
  - Nombre: "Prueba"
  - Apellido: "Sistema"
  - DNI: "99999999"
  - Edad: "15"
  - Género: "Masculino"
  - Institución: (seleccionar una)
  - Aula: (seleccionar una)
- Clic en **"Guardar"**
- Debe aparecer un mensaje de éxito (SweetAlert2)
- El nuevo alumno debe aparecer en la tabla

**Prueba 4: Ver Notas de un Alumno**

- En la tabla de alumnos, clic en el botón **👁️ Ver Notas** de cualquier alumno
- Debe abrir un modal con el historial de notas
- Debe mostrar: Materia, Prueba, Fecha, Calificación
- Debe calcular el promedio al final

---

## 6. SOLUCIÓN DE PROBLEMAS COMUNES

### 6.1. Problema: "No se puede conectar al servidor MySQL"

**Causa:** El servicio MySQL no está corriendo

**Solución:**

1. Abrir Panel de Control de XAMPP
2. Clic en **"Start"** junto a MySQL
3. Esperar a que cambie a verde
4. Refrescar la página del sistema (F5)

---

### 6.2. Problema: "404 Not Found"

**Causa:** La ruta de los archivos no es correcta

**Solución:**

1. Verificar que la carpeta esté en `C:\xampp\htdocs\alumnos_academico_app\`
2. Verificar que la URL sea correcta: `http://localhost/alumnos_academico_app/`
3. Probar con: `http://localhost/alumnos_academico_app/index.html`

---

### 6.3. Problema: "Database connection failed"

**Causa 1:** La base de datos no existe

**Solución:**
- Volver a la sección **3.2** y crear la base de datos
- Verificar en phpMyAdmin que existe `db_alumnoss`

**Causa 2:** Credenciales incorrectas en `api.php`

**Solución:**
- Editar `api.php`
- Verificar: `$user = "root"` y `$pass = ""`
- Guardar y recargar

**Causa 3:** El puerto de MySQL está cambiado

**Solución:**
- En `api.php`, cambiar `$host = "localhost"` por `$host = "localhost:3307"` (si usas puerto alternativo)

---

### 6.4. Problema: Apache no inicia (Puerto 80 ocupado)

**Causa:** Otra aplicación está usando el puerto 80 (Skype, IIS, etc.)

**Solución 1:** Cambiar puerto de Apache a 8080

1. Panel de XAMPP → Clic en **"Config"** (botón de Apache)
2. Seleccionar **"httpd.conf"**
3. Buscar `Listen 80` (Ctrl+F)
4. Cambiar por `Listen 8080`
5. Buscar `ServerName localhost:80`
6. Cambiar por `ServerName localhost:8080`
7. Guardar y reiniciar Apache
8. Acceder al sistema con: `http://localhost:8080/alumnos_academico_app/`

**Solución 2:** Cerrar la aplicación que usa el puerto 80

1. Abrir CMD como administrador
2. Ejecutar: `netstat -ano | findstr :80`
3. Ver el PID de la aplicación
4. Abrir Administrador de Tareas
5. Buscar por PID y finalizar proceso

---

### 6.5. Problema: "Access Denied" en phpMyAdmin

**Causa:** Contraseña incorrecta de MySQL

**Solución:**

**Método 1:** Resetear contraseña de root

1. Detener MySQL en Panel de XAMPP
2. Abrir `C:\xampp\mysql\bin\`
3. Ejecutar CMD en esa carpeta
4. Comando:
   ```bash
   mysqld --skip-grant-tables
   ```
5. Abrir otra ventana de CMD
6. Ejecutar:
   ```bash
   mysql -u root
   UPDATE mysql.user SET Password=PASSWORD('') WHERE User='root';
   FLUSH PRIVILEGES;
   EXIT;
   ```
7. Reiniciar MySQL

**Método 2:** Usar usuario diferente

1. Crear nuevo usuario en MySQL con privilegios completos
2. Modificar `api.php` con las nuevas credenciales

---

### 6.6. Problema: Los modales no se ven completos (mucho scroll)

**Causa:** Caché del navegador con CSS antiguo

**Solución:**

1. Forzar recarga completa:
   - Chrome/Firefox: Ctrl + Shift + R
   - Edge: Ctrl + F5
2. Limpiar caché del navegador:
   - Chrome: Menú → Más herramientas → Borrar datos de navegación
   - Seleccionar "Imágenes y archivos en caché"
   - Clic en "Borrar datos"
3. Cerrar y volver a abrir el navegador

---

### 6.7. Problema: No aparecen los gráficos en Estadísticas

**Causa:** Chart.js no se cargó (problema de conexión a CDN)

**Solución:**

1. Verificar conexión a Internet (Chart.js se carga desde CDN)
2. Abrir Consola de Desarrollador (F12)
3. Ver errores en la pestaña "Console"
4. Si hay error 404 en Chart.js:
   - Descargar Chart.js manualmente
   - Guardarlo en la carpeta del proyecto
   - Editar `estadisticas.html` para usar versión local

---

## 7. ACCESO AL SISTEMA

### 7.1. URLs de Acceso

**Dashboard Principal:**
```
http://localhost/alumnos_academico_app/
http://localhost/alumnos_academico_app/index.html
```

**Módulo de Alumnos:**
```
http://localhost/alumnos_academico_app/alumnos.html
```

**Módulo de Estadísticas:**
```
http://localhost/alumnos_academico_app/estadisticas.html
```

**Módulo de Pruebas:**
```
http://localhost/alumnos_academico_app/pruebas.html
```

**phpMyAdmin (gestión de BD):**
```
http://localhost/phpmyadmin
```

---

### 7.2. Usuarios y Permisos

⚠️ **IMPORTANTE:** Este sistema NO tiene autenticación de usuarios implementada.

En un entorno de producción, se debería:
1. Implementar login con sesiones PHP
2. Crear roles (administrador, profesor, alumno)
3. Restringir acceso según permisos
4. Usar HTTPS para conexiones seguras

**Para desarrollo académico:**
- Cualquiera con acceso a `localhost` puede usar el sistema
- Solo accesible desde la misma computadora (no desde red)

---

### 7.3. Datos de Prueba

El sistema viene con datos precargados:

| Entidad | Cantidad |
|---------|----------|
| Instituciones | 3 |
| Profesores | 10 |
| Aulas | 12 |
| Materias | 15 |
| Alumnos | 55+ |
| Pruebas | 30+ |
| Notas | 200+ |

**Recomendación:** Explorar todas las tablas antes de agregar datos propios.

---

## 8. MANTENIMIENTO Y RESPALDO

### 8.1. Hacer Backup de la Base de Datos

**Método 1: phpMyAdmin (recomendado)**

1. Ir a `http://localhost/phpmyadmin`
2. Seleccionar la base de datos `db_alumnoss`
3. Clic en pestaña **"Exportar"**
4. Seleccionar **"Método: Rápido"**
5. Formato: **"SQL"**
6. Clic en **"Continuar"**
7. Se descargará `db_alumnoss.sql`

**Método 2: Línea de comandos**

```bash
cd C:\xampp\mysql\bin
mysqldump -u root db_alumnoss > backup_db_alumnoss.sql
```

---

### 8.2. Restaurar Backup

**Si perdiste datos o quieres volver a un estado anterior:**

1. Ir a phpMyAdmin
2. Seleccionar `db_alumnoss`
3. Clic en **"Importar"**
4. Seleccionar el archivo `.sql` del backup
5. Clic en **"Continuar"**

---

### 8.3. Actualizar el Sistema

**Si hay una nueva versión:**

1. Hacer backup de la base de datos (sección 8.1)
2. Copiar la carpeta actual a un lugar seguro:
   ```
   C:\xampp\htdocs\alumnos_academico_app  →  C:\backup\alumnos_academico_app_old
   ```
3. Eliminar la carpeta antigua de `htdocs`
4. Copiar la nueva versión a `htdocs`
5. Importar el backup de la BD si es necesario

---

## 9. DESINSTALACIÓN

### 9.1. Desinstalar el Sistema

**Paso 1:** Eliminar carpeta del sistema:
```
C:\xampp\htdocs\alumnos_academico_app
```

**Paso 2:** Eliminar base de datos en phpMyAdmin:
1. Ir a `http://localhost/phpmyadmin`
2. Seleccionar `db_alumnoss`
3. Clic en **"Operaciones"**
4. Scroll hasta abajo → **"Eliminar base de datos"**
5. Confirmar

**Paso 3:** (Opcional) Desinstalar XAMPP:
- Windows: Panel de Control → Programas → Desinstalar XAMPP
- Linux: `sudo /opt/lampp/uninstall`

---

## 10. CONTACTO Y SOPORTE

Para consultas sobre este sistema:

**Desarrolladores:**
- [Nombres de integrantes del grupo]
- [Emails de contacto]

**Institución:**
- [Nombre de la institución educativa]
- Materia: Base de Datos I/II + Análisis de Datos
- Año: 2025

**Repositorio (si aplica):**
- GitHub: [URL del repositorio]

---

## 11. LICENCIA

Este proyecto fue desarrollado con fines académicos para el TP Final Integrador de las materias Base de Datos I/II y Análisis de Datos.

**Uso permitido:**
- Fines educativos
- Proyectos personales
- Portafolio profesional

**Uso NO permitido:**
- Venta del código fuente
- Redistribución sin créditos
- Uso comercial sin autorización

---

*Guía de Instalación - Versión 1.0*  
*Fecha de actualización: Noviembre 2025*  
*Sistema de Gestión Académica - TP Final Integrador*
