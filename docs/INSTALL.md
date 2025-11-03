# Guía de Instalación Detallada
## Sistema de Gestión Académica Completa

---

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de XAMPP](#instalación-de-xampp)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Creación de la Base de Datos](#creación-de-la-base-de-datos)
5. [Verificación de la Instalación](#verificación-de-la-instalación)
6. [Solución de Problemas](#solución-de-problemas)

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Windows 10/11 (64 bits)
- ✅ Al menos 500 MB de espacio libre en disco
- ✅ Permisos de administrador en tu computadora
- ✅ Navegador web moderno instalado (Chrome, Firefox, Edge)
- ✅ El archivo comprimido del proyecto descargado

---

## 2. Instalación de XAMPP

### Paso 2.1: Descargar XAMPP

1. Abre tu navegador web
2. Ve a: [https://www.apachefriends.org](https://www.apachefriends.org)
3. Haz clic en **"XAMPP for Windows"**
4. Descarga la versión **8.2.12** o superior
5. Espera a que termine la descarga (aprox. 150 MB)

### Paso 2.2: Instalar XAMPP

1. Localiza el archivo descargado: `xampp-windows-x64-8.2.12-installer.exe`
2. Haz **doble clic** en el archivo
3. Si aparece el Control de Cuentas de Usuario (UAC), haz clic en **"Sí"**
4. Si aparece una advertencia sobre el Firewall, selecciona **"Aceptar"**
5. En la pantalla de bienvenida, haz clic en **"Next"**
6. Selecciona los componentes (deja los predeterminados):
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ✅ phpMyAdmin
7. Haz clic en **"Next"**
8. Selecciona la carpeta de instalación: `C:\xampp` (recomendado)
9. Haz clic en **"Next"**
10. Desmarca "Learn more about Bitnami" y haz clic en **"Next"**
11. Haz clic en **"Next"** para iniciar la instalación
12. Espera a que termine la instalación (aprox. 5-10 minutos)
13. Al finalizar, marca "Do you want to start the Control Panel now?"
14. Haz clic en **"Finish"**

### Paso 2.3: Configurar el Panel de Control

1. El Panel de Control de XAMPP se abrirá automáticamente
2. Si aparece una alerta del Firewall de Windows:
   - Marca **"Redes privadas"**
   - Haz clic en **"Permitir acceso"**
3. En el Panel de Control, haz clic en **"Config"** (esquina superior derecha)
4. Marca la opción **"Autostart of modules: Apache y MySQL"** (opcional)

---

## 3. Configuración del Proyecto

### Paso 3.1: Extraer los Archivos

1. Localiza el archivo comprimido del proyecto: `sistema-academico.zip` (o similar)
2. Haz clic derecho sobre el archivo
3. Selecciona **"Extraer todo..."**
4. En la ventana que aparece, haz clic en **"Examinar"**
5. Navega hasta la carpeta: `C:\xampp\htdocs\`
6. Haz clic en **"Seleccionar carpeta"**
7. Haz clic en **"Extraer"**
8. Verifica que se haya creado la carpeta: `C:\xampp\htdocs\alumnos_academico_app\`

### Paso 3.2: Verificar la Estructura de Archivos

Abre la carpeta `C:\xampp\htdocs\alumnos_academico_app\` y verifica que contenga:

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
    ├── INSTALL.md
    ├── CONSULTAS.md
    └── screenshots/
```

---

## 4. Creación de la Base de Datos

### Paso 4.1: Iniciar los Servicios

1. Abre el **Panel de Control de XAMPP**
2. Haz clic en el botón **"Start"** junto a **Apache**
   - Espera a que se ponga en verde
   - Debe decir "Running" en verde
3. Haz clic en el botón **"Start"** junto a **MySQL**
   - Espera a que se ponga en verde
   - Debe decir "Running" en verde

**Nota**: Si los botones no cambian a verde, consulta la sección de [Solución de Problemas](#solución-de-problemas)

### Paso 4.2: Acceder a phpMyAdmin

1. Abre tu navegador web
2. En la barra de direcciones, escribe: `http://localhost/phpmyadmin`
3. Presiona **Enter**
4. Deberías ver la interfaz de phpMyAdmin

### Paso 4.3: Crear la Base de Datos

1. En phpMyAdmin, haz clic en la pestaña **"Bases de datos"** (arriba)
2. En el campo "Nombre de la base de datos", escribe: `db_alumnoss`
3. En el menú desplegable "Cotejamiento", selecciona: `utf8mb4_unicode_ci`
4. Haz clic en el botón **"Crear"**
5. Verás un mensaje verde de confirmación

### Paso 4.4: Importar los Datos

1. En el panel izquierdo, haz clic en la base de datos **db_alumnoss** que acabas de crear
2. Haz clic en la pestaña **"Importar"** (arriba)
3. Haz clic en el botón **"Seleccionar archivo"**
4. Navega hasta: `C:\xampp\htdocs\alumnos_academico_app\database\db_alumnoss_complete.sql`
5. Selecciona el archivo y haz clic en **"Abrir"**
6. Desplázate hacia abajo y haz clic en el botón **"Continuar"**
7. Espera a que termine la importación (5-10 segundos)
8. Verás un mensaje verde: "Importación finalizada con éxito"

### Paso 4.5: Verificar la Importación

1. En phpMyAdmin, con la base de datos **db_alumnoss** seleccionada
2. Verás una lista de tablas en el panel izquierdo:
   - instituciones
   - profesores
   - aulas
   - materias
   - aula_materia
   - alumnos
   - pruebas
   - notas
3. Haz clic en cualquier tabla (por ejemplo, "alumnos")
4. Verás registros de datos
5. Si ves datos, ¡la importación fue exitosa! ✅

---

## 5. Verificación de la Instalación

### Paso 5.1: Probar la Página Principal

1. Abre tu navegador web
2. En la barra de direcciones, escribe: `http://localhost/alumnos_academico_app/`
3. Presiona **Enter**
4. Deberías ver la página principal del sistema con:
   - Barra superior azul con el título "Gestión Académica"
   - Sidebar izquierdo con botones
   - Panel central con tarjetas de datos

**✅ Si ves esto, ¡la instalación fue exitosa!**

### Paso 5.2: Probar las Funcionalidades

#### Test 1: Ver Alumnos
1. En el sidebar, haz clic en **"Ver Alumnos"**
2. Deberías ver una lista de alumnos
3. Intenta filtrar por institución
4. Intenta buscar un alumno

#### Test 2: Ver Estadísticas
1. Vuelve a la página principal (botón "Volver")
2. En el sidebar, haz clic en **"Ver Estadísticas"**
3. Deberías ver:
   - Cards con métricas
   - Gráfico de distribución por género
   - Tablas con estadísticas

#### Test 3: Crear un Alumno
1. Vuelve a la página principal
2. En el sidebar, haz clic en **"Nuevo Alumno"**
3. Completa el formulario de prueba
4. Haz clic en "Guardar"
5. Deberías ver una notificación de éxito

**✅ Si todas las pruebas funcionan, ¡el sistema está completamente operativo!**

---

## 6. Solución de Problemas

### Problema 1: Apache no inicia

**Síntoma**: El botón de Apache no se pone en verde

**Soluciones**:

1. **Puerto 80 ocupado** (causa más común)
   - Haz clic en "Netstat" en el Panel de XAMPP
   - Busca el puerto 80
   - Si está ocupado por otro programa:
     - En XAMPP, haz clic en "Config" junto a Apache
     - Selecciona "httpd.conf"
     - Busca la línea: `Listen 80`
     - Cámbiala por: `Listen 8080`
     - Guarda el archivo
     - Intenta iniciar Apache nuevamente
     - Ahora accede al sistema con: `http://localhost:8080/alumnos_academico_app/`

2. **Skype ocupando el puerto**
   - Cierra Skype completamente
   - Reinicia XAMPP
   - Intenta iniciar Apache nuevamente

3. **Firewall bloqueando**
   - Ve a "Panel de Control" > "Firewall de Windows"
   - Haz clic en "Permitir una aplicación a través de Firewall"
   - Busca "Apache" y marca las casillas
   - Reinicia XAMPP

### Problema 2: MySQL no inicia

**Síntoma**: El botón de MySQL no se pone en verde

**Soluciones**:

1. **Puerto 3306 ocupado**
   - En XAMPP, haz clic en "Config" junto a MySQL
   - Selecciona "my.ini"
   - Busca la línea: `port=3306`
   - Cámbiala por: `port=3307`
   - Guarda el archivo
   - En `api.php`, cambia la conexión:
     ```php
     $mysqli = new mysqli("localhost:3307","root","","db_alumnoss");
     ```

2. **Otro servicio MySQL corriendo**
   - Abre "Administrador de tareas" (Ctrl + Shift + Esc)
   - Ve a la pestaña "Servicios"
   - Busca "MySQL" o "MariaDB"
   - Si está corriendo, haz clic derecho > "Detener"
   - Intenta iniciar MySQL en XAMPP nuevamente

### Problema 3: Error "Cannot connect to database"

**Síntoma**: Mensaje de error al abrir la página

**Soluciones**:

1. **Verificar que MySQL esté iniciado**
   - Abre el Panel de XAMPP
   - Verifica que MySQL esté en verde ("Running")

2. **Verificar las credenciales**
   - Abre el archivo: `C:\xampp\htdocs\alumnos_academico_app\api.php`
   - Busca la línea 3:
     ```php
     $mysqli = new mysqli("localhost","root","","db_alumnoss");
     ```
   - Verifica que coincida con tu configuración

3. **Verificar que la base de datos exista**
   - Ve a phpMyAdmin: `http://localhost/phpmyadmin`
   - Verifica que existe la base de datos "db_alumnoss"
   - Si no existe, repite el [Paso 4](#4-creación-de-la-base-de-datos)

### Problema 4: Página en blanco o error 404

**Síntoma**: No se muestra nada o dice "Not Found"

**Soluciones**:

1. **Verificar la ruta de los archivos**
   - Verifica que los archivos estén en: `C:\xampp\htdocs\alumnos_academico_app\`
   - No deben estar en subcarpetas adicionales

2. **Verificar la URL**
   - Debe ser: `http://localhost/alumnos_academico_app/`
   - NO: `file:///C:/xampp/htdocs/...`

3. **Verificar que Apache esté iniciado**
   - Abre el Panel de XAMPP
   - Verifica que Apache esté en verde

### Problema 5: Los gráficos no se muestran

**Síntoma**: Las estadísticas no muestran los gráficos

**Soluciones**:

1. **Verificar conexión a internet**
   - Chart.js se carga desde CDN
   - Verifica que tengas conexión a internet

2. **Limpiar caché del navegador**
   - Presiona: `Ctrl + Shift + Delete`
   - Marca "Caché" o "Archivos temporales"
   - Haz clic en "Borrar datos"
   - Recarga la página con: `Ctrl + Shift + R`

3. **Verificar la consola del navegador**
   - Presiona `F12` para abrir las herramientas de desarrollo
   - Ve a la pestaña "Console"
   - Si hay errores en rojo, anota el mensaje
   - Busca soluciones específicas para ese error

### Problema 6: No se pueden cargar datos

**Síntoma**: Los formularios no guardan o las listas están vacías

**Soluciones**:

1. **Verificar datos en la base de datos**
   - Ve a phpMyAdmin
   - Selecciona la base de datos "db_alumnoss"
   - Haz clic en cada tabla y verifica que tengan datos
   - Si están vacías, reimporta el archivo SQL

2. **Verificar permisos de archivos**
   - En algunos casos, XAMPP puede necesitar permisos
   - Haz clic derecho en la carpeta `alumnos_academico_app`
   - Propiedades > Seguridad
   - Asegúrate de tener permisos de "Lectura y escritura"

---

## 🎓 Consejos Finales

1. **Cierra siempre XAMPP** cuando no lo uses para liberar recursos
2. **Haz backups** de la base de datos antes de hacer cambios importantes
3. **Documenta** cualquier modificación que hagas
4. **Prueba** cada funcionalidad después de instalar

---

## 📞 ¿Necesitas Ayuda Adicional?

Si seguiste todos estos pasos y aún tienes problemas:

1. Anota el **mensaje de error exacto** que aparece
2. Toma una **captura de pantalla** del error
3. Revisa el archivo de **logs de Apache**: `C:\xampp\apache\logs\error.log`
4. Revisa el archivo de **logs de MySQL**: `C:\xampp\mysql\data\mysql_error.log`
5. Consulta con tu profesor o compañeros de clase

---

**¡Buena suerte con tu proyecto!** 🚀
