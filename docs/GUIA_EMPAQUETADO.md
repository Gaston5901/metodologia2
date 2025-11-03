# Guía de Empaquetado para Entrega
## Trabajo Práctico Final Integrador - Noviembre 2025

---

## 📦 Objetivo

Preparar el archivo comprimido (.zip o .rar) con la estructura correcta para entregar el Trabajo Práctico Final Integrador.

---

## 📋 Estructura de Carpetas Requerida

```
TP_Final_Integrador_BDD_2025/
│
├── README.md                          ← Documentación principal
├── db_alumnoss_complete.sql           ← Script de base de datos
│
├── src/                                ← Código fuente de la aplicación
│   ├── index.html
│   ├── alumnos.html
│   ├── pruebas.html
│   ├── estadisticas.html
│   ├── script.js
│   ├── alumnos.js
│   ├── pruebas.js
│   ├── estadisticas.js
│   ├── styles_new.css
│   └── api.php
│
├── docs/                               ← Documentación técnica
│   ├── INSTALL.md
│   ├── CONSULTAS.md
│   ├── DOCUMENTO_TECNICO.md
│   ├── DOCUMENTO_TECNICO.pdf          ← Convertido desde MD
│   └── SCREENSHOTS.md
│
└── screenshots/                        ← Capturas de pantalla
    ├── 01_dashboard_principal.png
    ├── 02_alumnos_listado.png
    ├── 03_modal_crear_alumno.png
    ├── 04_modal_editar_alumno.png
    ├── 05_modal_ver_notas.png
    ├── 06_pruebas_listado.png
    ├── 07_estadisticas_general.png
    ├── 08_estadisticas_metricas.png
    ├── 09_grafico_genero.png
    ├── 10_panel_rendimiento.png
    ├── 11_tabla_aulas.png
    ├── 12_tabla_materias.png
    ├── 13_filtros_aplicados.png
    ├── 14_paginacion_activa.png
    └── 15_responsive_mobile.png
```

---

## 📝 Pasos para Preparar la Entrega

### Paso 1: Crear la Estructura de Carpetas

Desde PowerShell en `C:\xampp\htdocs\alumnos_academico_app`:

```powershell
# Crear carpeta de entrega en el escritorio
New-Item -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025" -ItemType Directory -Force

# Crear subcarpetas
New-Item -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\screenshots" -ItemType Directory -Force
```

---

### Paso 2: Copiar Archivos de Código Fuente

```powershell
# Desde C:\xampp\htdocs\alumnos_academico_app

# Copiar archivos HTML, JS, CSS y PHP a src/
Copy-Item "index.html" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "alumnos.html" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "pruebas.html" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "estadisticas.html" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "script.js" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "alumnos.js" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "pruebas.js" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "estadisticas.js" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "styles_new.css" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
Copy-Item "api.php" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\src\"
```

---

### Paso 3: Copiar Archivos de Documentación

```powershell
# Copiar README a la raíz
Copy-Item "README.md" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\"

# Copiar SQL a la raíz
Copy-Item "db_alumnoss_complete.sql" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\"

# Copiar documentos técnicos a docs/
Copy-Item "docs\INSTALL.md" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs\"
Copy-Item "docs\CONSULTAS.md" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs\"
Copy-Item "docs\DOCUMENTO_TECNICO.md" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs\"
Copy-Item "docs\SCREENSHOTS.md" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs\"
```

---

### Paso 4: Copiar Screenshots

```powershell
# Copiar todas las imágenes de screenshots/
Copy-Item "docs\screenshots\*.png" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\screenshots\"
```

**⚠️ IMPORTANTE**: Antes de este paso, debes haber capturado las 15 imágenes siguiendo la guía `SCREENSHOTS.md`.

---

### Paso 5: Convertir DOCUMENTO_TECNICO.md a PDF

**Opción 1: Usando Typora (Recomendado)**

1. Descargar e instalar Typora: [https://typora.io/](https://typora.io/)
2. Abrir `docs\DOCUMENTO_TECNICO.md`
3. Ir a `Archivo` → `Exportar` → `PDF`
4. Guardar como `DOCUMENTO_TECNICO.pdf` en la carpeta `docs/`

**Opción 2: Usando Pandoc (Línea de comandos)**

```powershell
# Instalar Pandoc (si no está instalado)
# Descargar desde: https://pandoc.org/installing.html

# Convertir MD a PDF
cd docs
pandoc DOCUMENTO_TECNICO.md -o DOCUMENTO_TECNICO.pdf --pdf-engine=xelatex -V geometry:margin=1in

# Copiar PDF a carpeta de entrega
Copy-Item "DOCUMENTO_TECNICO.pdf" -Destination "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025\docs\"
```

**Opción 3: Usando Word (Manual)**

1. Abrir `DOCUMENTO_TECNICO.md` con un editor de texto
2. Copiar todo el contenido
3. Abrir Microsoft Word
4. Pegar el contenido
5. Aplicar formato:
   - Títulos con estilos Heading 1, 2, 3
   - Bloques de código con fuente Courier New
   - Tablas con bordes
6. Guardar como PDF: `Archivo` → `Guardar como` → Tipo: PDF
7. Copiar el PDF a `docs/` en la carpeta de entrega

**Opción 4: Usando herramienta online**

1. Ir a [https://www.markdowntopdf.com/](https://www.markdowntopdf.com/)
2. Subir `DOCUMENTO_TECNICO.md`
3. Descargar el PDF generado
4. Renombrar a `DOCUMENTO_TECNICO.pdf`
5. Copiar a la carpeta `docs/`

---

### Paso 6: Verificar la Estructura

**Checklist de verificación**:

```
✅ README.md en la raíz
✅ db_alumnoss_complete.sql en la raíz
✅ Carpeta src/ con 10 archivos (5 HTML, 4 JS, 1 CSS, 1 PHP)
✅ Carpeta docs/ con 5 archivos (4 MD + 1 PDF)
✅ Carpeta screenshots/ con mínimo 10 imágenes PNG
✅ Sin archivos temporales (.tmp, .bak, ~$, etc.)
✅ Sin carpetas de sistema (.git, node_modules, .vscode, etc.)
```

**Script de verificación** (opcional):

```powershell
cd "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025"

Write-Host "=== VERIFICACIÓN DE ESTRUCTURA ===" -ForegroundColor Cyan
Write-Host ""

# Archivos raíz
Write-Host "Archivos en raíz:" -ForegroundColor Yellow
Get-ChildItem -File | Select-Object Name

# Carpeta src
Write-Host "`nArchivos en src/:" -ForegroundColor Yellow
Get-ChildItem src -File | Select-Object Name

# Carpeta docs
Write-Host "`nArchivos en docs/:" -ForegroundColor Yellow
Get-ChildItem docs -File | Select-Object Name

# Carpeta screenshots
Write-Host "`nImágenes en screenshots/:" -ForegroundColor Yellow
Get-ChildItem screenshots -File | Select-Object Name

# Resumen
Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Total archivos src/: $((Get-ChildItem src -File).Count)" -ForegroundColor Green
Write-Host "Total archivos docs/: $((Get-ChildItem docs -File).Count)" -ForegroundColor Green
Write-Host "Total screenshots/: $((Get-ChildItem screenshots -File).Count)" -ForegroundColor Green
```

---

### Paso 7: Comprimir el Proyecto

**Opción 1: Usando PowerShell (Windows 10/11)**

```powershell
# Comprimir a ZIP
Compress-Archive -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025" -DestinationPath "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025.zip" -Force

Write-Host "✅ Archivo comprimido creado: TP_Final_Integrador_BDD_2025.zip" -ForegroundColor Green
```

**Opción 2: Usando WinRAR (si está instalado)**

1. Clic derecho en la carpeta `TP_Final_Integrador_BDD_2025`
2. `Agregar al archivo...`
3. Configuración:
   - **Nombre**: `TP_Final_Integrador_BDD_2025.rar`
   - **Formato**: RAR o ZIP
   - **Método de compresión**: Normal
   - **Tamaño del volumen**: Sin límite
4. Clic en `Aceptar`

**Opción 3: Usando 7-Zip (gratuito)**

1. Descargar e instalar 7-Zip: [https://www.7-zip.org/](https://www.7-zip.org/)
2. Clic derecho en la carpeta `TP_Final_Integrador_BDD_2025`
3. `7-Zip` → `Agregar a "TP_Final_Integrador_BDD_2025.zip"`

---

### Paso 8: Verificar el Archivo Comprimido

**Antes de entregar**:

1. **Extraer en carpeta temporal** para verificar:
   ```powershell
   Expand-Archive -Path "$env:USERPROFILE\Desktop\TP_Final_Integrador_BDD_2025.zip" -DestinationPath "$env:TEMP\verificacion_tp" -Force
   cd "$env:TEMP\verificacion_tp\TP_Final_Integrador_BDD_2025"
   ls
   ```

2. **Verificar tamaño del archivo**:
   - Tamaño esperado: 5-20 MB (dependiendo de las imágenes)
   - Si es mayor a 50 MB, revisar que no haya archivos innecesarios

3. **Verificar integridad**:
   - Abrir el ZIP y navegar por las carpetas
   - Confirmar que todos los archivos estén presentes
   - Verificar que las imágenes se vean correctamente

---

## 📤 Preparación para la Entrega

### Información que Debes Completar Antes de Entregar

**En README.md** (sección Autores):
```markdown
## 👥 Autores

**Equipo de desarrollo**:
- [Nombre completo 1] - [email@dominio.com]
- [Nombre completo 2] - [email@dominio.com]
- [Nombre completo 3] - [email@dominio.com]

**Carrera**: Tecnicatura Universitaria en Programación  
**Institución**: [Nombre de tu institución]  
**Año**: Segundo Año  
**Asignaturas**: Base de Datos I + Base de Datos II + Introducción al Análisis de Datos  
**Fecha de entrega**: 15 de Noviembre de 2025
```

**En DOCUMENTO_TECNICO.md** (sección inicial):
```markdown
**Autores**: [Completar con nombres de los integrantes]
```

---

### Medios de Entrega

**Según las indicaciones del docente**, podrías entregar por:

1. **Campus Virtual / Plataforma educativa**:
   - Subir el archivo `.zip` o `.rar`
   - Respetar el límite de tamaño (usualmente 50-100 MB)

2. **Google Drive / OneDrive**:
   - Subir el archivo
   - Compartir el enlace con permisos de "Ver"
   - Enviar el enlace por email o campus

3. **Email directo**:
   - Adjuntar el archivo comprimido
   - Asunto: "TP Final Integrador - BDD I/II - [Tu Nombre]"

4. **Repositorio Git** (opcional):
   - Subir a GitHub/GitLab
   - Crear un release con el archivo comprimido
   - Compartir el enlace del repositorio

---

## ⚠️ Errores Comunes a Evitar

### ❌ NO incluir:

- Carpetas de control de versiones (`.git/`, `.svn/`)
- Carpetas de configuración de editores (`.vscode/`, `.idea/`)
- Archivos temporales (`~$documento.docx`, `*.tmp`, `*.bak`)
- Backups innecesarios (`backup_2025-10-25_stable/`)
- `node_modules/` (si tuvieras dependencias Node.js)
- Archivos de sistema (`.DS_Store`, `Thumbs.db`, `desktop.ini`)

### ✅ SÍ incluir:

- Todos los archivos de código fuente (HTML, CSS, JS, PHP)
- Script SQL completo con datos de prueba
- Documentación técnica (MD y PDF)
- Screenshots en buena calidad
- README explicativo

---

## 🔍 Checklist Final de Entrega

Antes de subir el archivo, confirma:

- [ ] El archivo comprimido se llama `TP_Final_Integrador_BDD_2025.zip` (o `.rar`)
- [ ] El tamaño del archivo es razonable (5-50 MB)
- [ ] La estructura de carpetas es correcta (src/, docs/, screenshots/)
- [ ] El README.md tiene los nombres de los autores completados
- [ ] El DOCUMENTO_TECNICO.pdf está generado y se ve bien
- [ ] Tienes al menos 10 screenshots esenciales
- [ ] El script SQL está incluido y funciona (probado)
- [ ] No hay archivos temporales o carpetas innecesarias
- [ ] Has probado extraer el ZIP en otra carpeta y funciona
- [ ] La fecha de entrega es correcta (15 de noviembre de 2025)
- [ ] Tienes una copia de respaldo del archivo comprimido

---

## 🎉 ¡Listo para Entregar!

Una vez completados todos los pasos, tu archivo `TP_Final_Integrador_BDD_2025.zip` estará listo para ser entregado.

**Recuerda**:
- Guardar una copia de respaldo en otro lugar (USB, nube)
- Anotar la fecha y hora de entrega
- Conservar el comprobante de entrega (si aplica)

**¡Mucha suerte con tu Trabajo Práctico Final!** 🚀

---

**Documento creado**: Noviembre 2025  
**Versión**: 1.0  
**Propósito**: Guía de empaquetado para entrega académica
