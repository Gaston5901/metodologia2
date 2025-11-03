# GUÍA DE ORGANIZACIÓN FINAL
## Cómo convertir a Word/PDF y organizar la entrega

---

## TABLA DE CONTENIDOS

1. Archivos para Imprimir (Convertir a Word/PDF)
2. Archivos que Quedan Solo Digitales
3. Cómo Convertir Markdown a Word
4. Cómo Combinar Todo en un Solo Documento
5. Orden de Impresión y Encuadernación
6. Preparar Carpeta Digital (ZIP)
7. Checklist Final de Entrega

---

## 1. ARCHIVOS PARA IMPRIMIR

### 📄 Documentos en `docs/` que DEBES IMPRIMIR:

| # | Archivo | Descripción | Páginas aprox. |
|---|---------|-------------|----------------|
| 1 | `01_PORTADA.md` | Carátula con datos del grupo | 1 |
| 2 | `02_INDICE.md` | Índice con numeración de páginas | 1-2 |
| 3 | `03_CAPTURAS_SISTEMA.md` | Las 15 capturas con descripciones | 20-25 |
| 4 | `04_DOCUMENTO_TECNICO_IMPRIMIBLE.md` | Documento técnico completo | 30-35 |
| 5 | `05_CONSULTAS_SQL_IMPRIMIBLE.md` | Consultas SQL documentadas | 15-20 |
| 6 | `06_GUIA_INSTALACION_IMPRIMIBLE.md` | Guía de instalación paso a paso | 15-18 |
| 7 | `07_CONCLUSIONES_FIRMAS.md` | Conclusiones y firmas | 8-10 |

**Total estimado: 90-111 páginas**

---

## 2. ARCHIVOS QUE QUEDAN SOLO DIGITALES

### 📁 NO imprimir (van en el ZIP):

| Archivo | Propósito |
|---------|-----------|
| `README.md` | Documentación general (para GitHub/lectura digital) |
| `INSTALL.md` | Guía de instalación original (reemplazada por versión imprimible) |
| `CONSULTAS.md` | Consultas SQL originales (reemplazada por versión imprimible) |
| `DOCUMENTO_TECNICO.md` | Documento técnico original (reemplazada por versión imprimible) |
| `SCREENSHOTS.md` | Guía de capturas (reemplazada por versión imprimible) |
| `GUIA_EMPAQUETADO.md` | Guía interna de preparación |
| `preparar_entrega.ps1` | Script de automatización |

### 💻 Código fuente (todos van en el ZIP):

| Archivos | Descripción |
|----------|-------------|
| `index.html`, `alumnos.html`, `estadisticas.html`, `pruebas.html` | Aplicación web |
| `api.php` | Backend |
| `script.js`, `alumnos.js`, `estadisticas.js`, `pruebas.js` | Lógica del frontend |
| `styles_new.css` | Estilos |
| `db_alumnoss_complete.sql` | Script de la base de datos |
| `backup_2025-10-25_stable/` | Backup de versiones anteriores |

---

## 3. CÓMO CONVERTIR MARKDOWN A WORD

### Opción 1: Typora (RECOMENDADO - Más fácil)

**Paso 1:** Descargar Typora (si no lo tenés)
```
https://typora.io/
```
- Es de pago pero tiene 15 días de prueba gratis
- Si ya lo tenés instalado, perfecto

**Paso 2:** Abrir cada archivo `.md` en Typora

**Paso 3:** Ir a `Archivo` → `Exportar` → `Word (.docx)`

**Paso 4:** Guardar en una carpeta temporal:
```
C:\Users\TuUsuario\Desktop\TP_Imprimir\
```

**Paso 5:** Repetir para los 7 archivos

---

### Opción 2: Pandoc (Línea de comandos)

**Paso 1:** Descargar e instalar Pandoc
```
https://pandoc.org/installing.html
```

**Paso 2:** Abrir PowerShell en la carpeta `docs/`

**Paso 3:** Ejecutar estos comandos:

```powershell
pandoc 01_PORTADA.md -o 01_PORTADA.docx
pandoc 02_INDICE.md -o 02_INDICE.docx
pandoc 03_CAPTURAS_SISTEMA.md -o 03_CAPTURAS_SISTEMA.docx
pandoc 04_DOCUMENTO_TECNICO_IMPRIMIBLE.md -o 04_DOCUMENTO_TECNICO_IMPRIMIBLE.docx
pandoc 05_CONSULTAS_SQL_IMPRIMIBLE.md -o 05_CONSULTAS_SQL_IMPRIMIBLE.docx
pandoc 06_GUIA_INSTALACION_IMPRIMIBLE.md -o 06_GUIA_INSTALACION_IMPRIMIBLE.docx
pandoc 07_CONCLUSIONES_FIRMAS.md -o 07_CONCLUSIONES_FIRMAS.docx
```

**Paso 4:** Los archivos `.docx` se crearán en la misma carpeta

---

### Opción 3: Visual Studio Code + Extensión

**Paso 1:** Instalar extensión "Markdown PDF" en VS Code

**Paso 2:** Abrir cada archivo `.md`

**Paso 3:** Presionar `Ctrl + Shift + P`

**Paso 4:** Buscar "Markdown PDF: Export (docx)"

**Paso 5:** Esperar que se genere el `.docx`

---

### Opción 4: Copiar y Pegar en Word (Manual pero funciona)

**Paso 1:** Abrir el archivo `.md` en VS Code o Notepad++

**Paso 2:** Seleccionar todo (Ctrl+A) y copiar (Ctrl+C)

**Paso 3:** Abrir Word y pegar (Ctrl+V)

**Paso 4:** Word reconocerá automáticamente:
- `#` como títulos (Título 1)
- `##` como subtítulos (Título 2)
- ` ``` ` como bloques de código

**Paso 5:** Ajustar formato manualmente:
- Márgenes: 2.5 cm (Normal)
- Fuente: Arial 11 o Times New Roman 12
- Interlineado: 1.5

**Paso 6:** Insertar saltos de página (`Ctrl + Enter`) entre secciones principales

---

## 4. CÓMO COMBINAR TODO EN UN SOLO DOCUMENTO

### 4.1. En Microsoft Word

**Opción A: Combinar manualmente (más control)**

**Paso 1:** Abrir `01_PORTADA.docx` en Word

**Paso 2:** Al final del documento, ir a:
```
Insertar → Salto de página
```

**Paso 3:** Ir a:
```
Insertar → Objeto → Texto de archivo...
```

**Paso 4:** Seleccionar `02_INDICE.docx`

**Paso 5:** Repetir pasos 2-4 con:
- `03_CAPTURAS_SISTEMA.docx`
- `04_DOCUMENTO_TECNICO_IMPRIMIBLE.docx`
- `05_CONSULTAS_SQL_IMPRIMIBLE.docx`
- `06_GUIA_INSTALACION_IMPRIMIBLE.docx`
- `07_CONCLUSIONES_FIRMAS.docx`

**Paso 6:** Revisar todo el documento combinado

**Paso 7:** Guardar como:
```
TP_Final_Integrador_BDD_2025_COMPLETO.docx
```

---

**Opción B: Usar script de PowerShell (automático)**

**Paso 1:** Crear archivo `combinar_word.ps1` con este código:

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false

$docs = @(
    "01_PORTADA.docx",
    "02_INDICE.docx",
    "03_CAPTURAS_SISTEMA.docx",
    "04_DOCUMENTO_TECNICO_IMPRIMIBLE.docx",
    "05_CONSULTAS_SQL_IMPRIMIBLE.docx",
    "06_GUIA_INSTALACION_IMPRIMIBLE.docx",
    "07_CONCLUSIONES_FIRMAS.docx"
)

$combinado = $word.Documents.Add()
$selection = $word.Selection

foreach ($doc in $docs) {
    $path = Join-Path $PWD $doc
    $selection.InsertFile($path)
    $selection.InsertBreak(7) # Salto de página
}

$outputPath = Join-Path $PWD "TP_Final_COMPLETO.docx"
$combinado.SaveAs([ref]$outputPath)
$combinado.Close()
$word.Quit()

Write-Host "Documento combinado creado: $outputPath"
```

**Paso 2:** Ejecutar en PowerShell:
```powershell
cd C:\xampp\htdocs\alumnos_academico_app\docs
.\combinar_word.ps1
```

---

### 4.2. Agregar Numeración de Páginas

**Paso 1:** En Word, ir a:
```
Insertar → Número de página → Parte inferior de la página → Número sin formato 3
```

**Paso 2:** La portada NO debe tener número. Para quitarlo:
- Doble clic en el pie de página de la portada
- Marcar "Primera página diferente"

**Paso 3:** Actualizar el índice con los números reales:
- Ir a la página del índice (02_INDICE)
- Buscar cada sección en el documento
- Reemplazar "Pág. X" por el número real

Ejemplo:
```
1. Introducción ........................... Pág. 3
2. Dominio del Problema ................... Pág. 5
3. Diseño de Base de Datos ................ Pág. 8
...
```

---

## 5. ORDEN DE IMPRESIÓN Y ENCUADERNACIÓN

### 5.1. Configuración de Impresión

**Márgenes:**
- Superior: 2.5 cm
- Inferior: 2.5 cm
- Izquierdo: 3 cm (espacio para encuadernación)
- Derecho: 2 cm

**Fuente recomendada:**
- Títulos: Arial 14, Negrita
- Subtítulos: Arial 12, Negrita
- Cuerpo: Arial 11 o Times New Roman 12
- Código: Courier New 10 (monoespaciado)

**Interlineado:**
- Títulos: Sencillo
- Cuerpo: 1.5
- Código: Sencillo

**Orientación:**
- Vertical (Portrait) para todo

---

### 5.2. Orden de Impresión

```
┌────────────────────────────────────────┐
│  1. PORTADA                            │  → 1 página
├────────────────────────────────────────┤
│  2. ÍNDICE                             │  → 1-2 páginas
├────────────────────────────────────────┤
│  3. CAPTURAS DEL SISTEMA               │  → 20-25 páginas
│     - DER                              │
│     - Dashboard                        │
│     - Alumnos                          │
│     - Estadísticas                     │
│     - Análisis                         │
├────────────────────────────────────────┤
│  4. DOCUMENTO TÉCNICO                  │  → 30-35 páginas
│     - Introducción                     │
│     - Dominio                          │
│     - Diseño BD                        │
│     - Normalización                    │
│     - Implementación                   │
│     - Análisis de Datos                │
│     - Funcionalidades                  │
│     - Conclusiones técnicas            │
│     - Tecnologías                      │
│     - Bibliografía                     │
├────────────────────────────────────────┤
│  5. CONSULTAS SQL                      │  → 15-20 páginas
│     - Básicas                          │
│     - JOIN                             │
│     - Agregación                       │
│     - Subconsultas                     │
│     - Avanzadas (CASE, UNION)          │
├────────────────────────────────────────┤
│  6. GUÍA DE INSTALACIÓN                │  → 15-18 páginas
│     - Requisitos                       │
│     - Instalación XAMPP                │
│     - Configuración BD                 │
│     - Instalación Sistema              │
│     - Verificación                     │
│     - Solución de problemas            │
├────────────────────────────────────────┤
│  7. CONCLUSIONES Y FIRMAS              │  → 8-10 páginas
│     - Síntesis                         │
│     - Logros técnicos                  │
│     - Aprendizajes                     │
│     - Reflexión personal               │
│     - Firmas de integrantes            │
│     - Espacio para corrección docente  │
└────────────────────────────────────────┘
```

**Total: 90-111 páginas**

---

### 5.3. Tipo de Encuadernación

**Recomendaciones según cantidad de páginas:**

**Si es 90-100 páginas:**
- ✅ Anillado (espiral metálico)
- ✅ Tapa transparente adelante
- ✅ Tapa negra/azul atrás
- Costo aproximado: $500-800

**Si es 100-120 páginas:**
- ✅ Encuadernación térmica (hot glue)
- ✅ Tapa blanda
- Costo aproximado: $800-1200

**Si es más de 120 páginas:**
- ✅ Encuadernación anillada doble
- O dividir en 2 tomos (Tomo 1: Documentación, Tomo 2: Código)

---

### 5.4. Portada de Encuadernación

Además de la portada interna (01_PORTADA.md), la tapa transparente debe mostrar:

```
┌─────────────────────────────────────────┐
│                                         │
│    [Logo de la institución]             │
│                                         │
│         TRABAJO PRÁCTICO FINAL          │
│              INTEGRADOR                 │
│                                         │
│    BASE DE DATOS I/II + ANÁLISIS DE     │
│                 DATOS                   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│      SISTEMA DE GESTIÓN ACADÉMICA       │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Integrantes:                           │
│  • [Nombre 1] - Legajo XXXXX           │
│  • [Nombre 2] - Legajo XXXXX           │
│  • [Nombre 3] - Legajo XXXXX           │
│                                         │
│  Profesor(es):                          │
│  • [Nombre del profesor]                │
│                                         │
│  Fecha de entrega: DD/MM/2025           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. PREPARAR CARPETA DIGITAL (ZIP)

### 6.1. Estructura de la Carpeta Digital

```
TP_Final_Integrador_BDD_Grupo_X/
│
├── 📄 README.txt                          (instrucciones básicas)
│
├── 📁 Sistema_Completo/
│   ├── index.html
│   ├── alumnos.html
│   ├── estadisticas.html
│   ├── pruebas.html
│   ├── api.php
│   ├── script.js
│   ├── alumnos.js
│   ├── estadisticas.js
│   ├── pruebas.js
│   ├── styles_new.css
│   └── db_alumnoss_complete.sql
│
├── 📁 Documentacion/
│   ├── README.md
│   ├── INSTALL.md
│   ├── CONSULTAS.md
│   ├── DOCUMENTO_TECNICO.md
│   ├── SCREENSHOTS.md
│   ├── GUIA_EMPAQUETADO.md
│   └── preparar_entrega.ps1
│
├── 📁 Capturas_Pantalla/
│   ├── DER.png
│   ├── Dashboard_Principal.png
│   ├── Alumnos_Listado.png
│   ├── ... (15 imágenes en total)
│
├── 📁 Backup/
│   └── backup_2025-10-25_stable/
│       ├── api.php
│       ├── index.html
│       └── ...
│
└── 📁 Documentos_Imprimibles/ (opcional)
    ├── 01_PORTADA.docx
    ├── 02_INDICE.docx
    ├── ...
    └── TP_Final_COMPLETO.docx
```

---

### 6.2. Crear el ZIP

**Método 1: Usando script automático (RECOMENDADO)**

**Paso 1:** Ya tenés el script `preparar_entrega.ps1` en tu carpeta

**Paso 2:** Ejecutar en PowerShell:

```powershell
cd C:\xampp\htdocs\alumnos_academico_app
.\preparar_entrega.ps1
```

**Paso 3:** Se creará automáticamente:
```
C:\xampp\htdocs\TP_Final_Integrador_BDD_2025.zip
```

---

**Método 2: Manual**

**Paso 1:** Crear carpeta temporal:
```
C:\Users\TuUsuario\Desktop\TP_Final_Integrador_BDD_Grupo_X\
```

**Paso 2:** Copiar estos archivos/carpetas:

```powershell
# Sistema completo
Copy-Item index.html, alumnos.html, estadisticas.html, pruebas.html, api.php, *.js, styles_new.css, db_alumnoss_complete.sql -Destination "C:\Users\TuUsuario\Desktop\TP_Final_Integrador_BDD_Grupo_X\Sistema_Completo\"

# Documentación
Copy-Item docs\*.md -Destination "C:\Users\TuUsuario\Desktop\TP_Final_Integrador_BDD_Grupo_X\Documentacion\"

# Capturas
Copy-Item docs\screenshots\*.png -Destination "C:\Users\TuUsuario\Desktop\TP_Final_Integrador_BDD_Grupo_X\Capturas_Pantalla\"

# Backup
Copy-Item backup_2025-10-25_stable -Recurse -Destination "C:\Users\TuUsuario\Desktop\TP_Final_Integrador_BDD_Grupo_X\Backup\"
```

**Paso 3:** Crear archivo `README.txt` en la raíz con:

```
SISTEMA DE GESTIÓN ACADÉMICA
TP Final Integrador - Base de Datos I/II + Análisis de Datos

CONTENIDO DEL ZIP:
==================

1. Sistema_Completo/
   - Contiene todos los archivos del sistema funcional
   - Para instalar: seguir instrucciones en Documentacion/INSTALL.md

2. Documentacion/
   - Toda la documentación técnica en formato Markdown
   - README.md: Información general del proyecto
   - INSTALL.md: Guía de instalación completa
   - CONSULTAS.md: Todas las consultas SQL documentadas
   - DOCUMENTO_TECNICO.md: Documento técnico completo (1260 líneas)

3. Capturas_Pantalla/
   - 15 capturas del sistema funcionando
   - Incluye DER, dashboard, módulos y estadísticas

4. Backup/
   - Versiones anteriores del código (respaldo)

INSTRUCCIONES DE INSTALACIÓN:
==============================

1. Copiar carpeta Sistema_Completo/ a C:\xampp\htdocs\
2. Importar db_alumnoss_complete.sql en phpMyAdmin
3. Acceder a http://localhost/Sistema_Completo/

Para más detalles, ver: Documentacion/INSTALL.md

INTEGRANTES:
============

• [Nombre 1] - DNI: XXXXXXXX - Legajo: XXXXX
• [Nombre 2] - DNI: XXXXXXXX - Legajo: XXXXX
• [Nombre 3] - DNI: XXXXXXXX - Legajo: XXXXX

Fecha de entrega: DD/MM/2025
```

**Paso 4:** Comprimir la carpeta:
- Clic derecho sobre la carpeta
- `Enviar a` → `Carpeta comprimida`
- Renombrar el ZIP: `TP_Final_Integrador_BDD_Grupo_X.zip`

---

### 6.3. Verificar el ZIP

**Antes de entregar, verificar que:**

✅ El ZIP no pesa más de 50 MB (debería ser 5-15 MB)  
✅ Se puede descomprimir sin errores  
✅ Todos los archivos están presentes (contar: 15 PNG + 7 MD + archivos del sistema)  
✅ El archivo `README.txt` tiene la información correcta  
✅ Los nombres de archivo no tienen caracteres especiales (ñ, acentos, espacios)  

---

## 7. CHECKLIST FINAL DE ENTREGA

### 7.1. Formato Impreso

```
☐ 1. Portada impresa con datos completos
☐ 2. Índice actualizado con números de página reales
☐ 3. Todas las capturas de pantalla visibles y en color
☐ 4. Código SQL legible (fuente monoespaciada)
☐ 5. Tablas y gráficos bien formateados
☐ 6. Márgenes correctos (3 cm izquierda para encuadernación)
☐ 7. Numeración de páginas (excepto portada)
☐ 8. Firmas de todos los integrantes
☐ 9. Espacio para firma del docente
☐ 10. Encuadernado (anillado o térmico)
☐ 11. Tapa transparente adelante
☐ 12. Sin páginas rotas o mal impresas
☐ 13. Total de páginas: 90-120 aproximadamente
```

---

### 7.2. Formato Digital

```
☐ 1. Carpeta con nombre: TP_Final_Integrador_BDD_Grupo_X
☐ 2. Estructura organizada (Sistema, Documentación, Capturas, Backup)
☐ 3. Archivo README.txt en la raíz
☐ 4. Todos los archivos HTML presentes
☐ 5. api.php con conexión correcta
☐ 6. db_alumnoss_complete.sql funcional
☐ 7. Las 15 capturas en formato PNG
☐ 8. Archivos Markdown de documentación
☐ 9. ZIP no corrupto (probar descomprimir)
☐ 10. Tamaño del ZIP: 5-15 MB
☐ 11. Sin archivos temporales (Thumbs.db, .DS_Store, etc.)
☐ 12. Sin carpetas de node_modules o vendor (si las hay)
```

---

### 7.3. Entrega Física

```
☐ 1. Presentarse en horario de entrega
☐ 2. Llevar impresión encuadernada
☐ 3. Llevar pendrive con ZIP (o enviado por mail/plataforma)
☐ 4. Llevar backup en otro pendrive (por las dudas)
☐ 5. Preparar explicación oral del proyecto (si lo piden)
☐ 6. Todos los integrantes presentes (si es requerido)
☐ 7. Vestimenta formal/semi-formal (según institución)
```

---

### 7.4. Revisión Final

**24 horas antes de entregar:**

```
☐ 1. Probar el sistema completo en una PC limpia
☐ 2. Verificar que XAMPP instala correctamente
☐ 3. Importar la BD desde cero
☐ 4. Probar todas las funcionalidades:
    ☐ Crear alumno
    ☐ Ver notas
    ☐ Cargar notas
    ☐ Ver estadísticas
    ☐ Filtros dinámicos
    ☐ Gráficos
☐ 5. Revisar que las capturas coincidan con el código entregado
☐ 6. Verificar errores en consola del navegador (F12)
☐ 7. Leer toda la documentación impresa (buscar typos)
☐ 8. Confirmar que las firmas están completas
☐ 9. Tener copias de respaldo (extra pendrive, email a uno mismo)
```

---

## 8. PREGUNTAS FRECUENTES

### 8.1. ¿Debo imprimir en color o blanco y negro?

**Recomendación:** 
- **Portada e índice:** Blanco y negro (ahorro)
- **Capturas de pantalla:** COLOR (necesario para ver gráficos)
- **Documento técnico:** Blanco y negro (diagramas se ven bien)
- **Consultas SQL:** Blanco y negro
- **Guía instalación:** Blanco y negro
- **Conclusiones:** Blanco y negro

**Alternativa económica:** Imprimir todo en B/N excepto las 15 páginas de capturas.

---

### 8.2. ¿Puedo entregar en 2 tomos separados?

**Sí, si el total supera las 120 páginas:**

**Tomo 1 - Documentación Académica:**
- Portada
- Índice
- Capturas
- Documento técnico
- Consultas SQL
- Conclusiones y firmas

**Tomo 2 - Documentación Técnica:**
- Portada específica (Tomo 2 - Instalación)
- Guía de instalación completa
- Anexos técnicos (si agregas algo)

---

### 8.3. ¿Qué hago si no tengo Typora ni Pandoc?

**Usar la Opción 4 (manual):**
1. Abrir el `.md` en Notepad++ o VS Code
2. Copiar todo el contenido
3. Pegar en Word
4. Word formateará automáticamente (reconoce `#`, ` ``` `, etc.)
5. Ajustar manualmente lo que se vea mal

**Es más trabajoso pero funciona perfectamente.**

---

### 8.4. ¿Debo entregar también el documento Word combinado en el ZIP?

**Opcional pero recomendado:**
- Crea una carpeta `Documentos_Imprimibles/` en el ZIP
- Incluye el `TP_Final_COMPLETO.docx`
- El docente puede revisar en digital si lo prefiere

---

### 8.5. ¿Qué pasa si el docente encuentra un error después de entregar?

**Si es error menor (typo, formato):**
- Generalmente no afecta la nota

**Si es error de funcionalidad (el sistema no anda):**
- Puede haber penalización
- Por eso es crucial probar todo 24hs antes

**Prevención:**
- Hacer una **prueba en otra PC** que no sea la tuya
- Pedirle a un compañero que instale tu sistema
- Si funciona en su PC, funcionará en la del docente

---

## 9. RESUMEN EJECUTIVO

### Para Imprimir:
1. Convertir 7 archivos `.md` a Word (Typora, Pandoc, o manual)
2. Combinar en un solo documento
3. Agregar numeración de páginas
4. Actualizar índice con páginas reales
5. Configurar márgenes: izquierda 3cm (encuadernación)
6. Imprimir (capturas en COLOR, resto B/N)
7. Encuadernar (anillado recomendado)
8. Firmar la sección de conclusiones

### Para el ZIP:
1. Ejecutar `preparar_entrega.ps1` (automático)  
   O copiar manualmente carpetas: Sistema, Documentación, Capturas, Backup
2. Crear archivo `README.txt` descriptivo
3. Comprimir todo en ZIP
4. Verificar que descomprime bien
5. Renombrar: `TP_Final_Integrador_BDD_Grupo_X.zip`

### Día de Entrega:
1. Llevar impresión encuadernada
2. Llevar pendrive con ZIP
3. Llevar backup extra (otro pendrive o en la nube)
4. Todos los integrantes presentes
5. Preparar explicación oral de 5-10 minutos

---

## 10. CONTACTO SI TENÉS DUDAS

Si algo no queda claro o tenés problemas técnicos:

**Revisar primero:**
- INSTALL.md (sección de solución de problemas)
- README.md (información general)

**Consultar con:**
- Compañeros del grupo
- Otros grupos del curso
- Docentes en horario de consulta

**Último recurso:**
- Foros de StackOverflow (para errores técnicos)
- Documentación oficial de MySQL, PHP, Chart.js

---

## ¡ÉXITOS CON LA ENTREGA!

Has llegado al final de la preparación. Si seguiste todos los pasos, tu entrega debería quedar **profesional y completa**.

**Recordá:**
- Empezar con tiempo (no dejar para último momento)
- Probar todo antes de entregar
- Hacer copias de respaldo
- Revisar el checklist completo

**¡Mucha suerte con la defensa y corrección del TP!** 🎓✨

---

*Guía de Organización Final - TP Final Integrador 2025*  
*Sistema de Gestión Académica - Base de Datos I/II + Análisis de Datos*
