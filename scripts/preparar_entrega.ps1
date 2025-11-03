# Script de Automatización - Preparación para Entrega
# Trabajo Práctico Final Integrador - Sistema de Gestión Académica
# Fecha: Noviembre 2025

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  TP FINAL INTEGRADOR - BASE DE DATOS  " -ForegroundColor Cyan
Write-Host "  Script de Preparación para Entrega   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Variables de configuración
$proyectoPath = "C:\xampp\htdocs\alumnos_academico_app"
$escritorio = "$env:USERPROFILE\Desktop"
$carpetaEntrega = "TP_Final_Integrador_BDD_2025"
$rutaEntrega = Join-Path $escritorio $carpetaEntrega

# Función para mostrar menú
function Show-Menu {
    Clear-Host
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "  MENÚ DE PREPARACIÓN PARA ENTREGA     " -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Verificar archivos del proyecto" -ForegroundColor Yellow
    Write-Host "2. Crear estructura de carpetas para entrega" -ForegroundColor Yellow
    Write-Host "3. Copiar archivos a carpeta de entrega" -ForegroundColor Yellow
    Write-Host "4. Verificar carpeta de entrega" -ForegroundColor Yellow
    Write-Host "5. Abrir carpeta de screenshots (para capturar)" -ForegroundColor Yellow
    Write-Host "6. Comprimir proyecto para entrega" -ForegroundColor Yellow
    Write-Host "7. Ejecutar TODO (pasos 2-6 completos)" -ForegroundColor Green
    Write-Host "8. Salir" -ForegroundColor Red
    Write-Host ""
}

# Función 1: Verificar archivos del proyecto
function Verify-ProjectFiles {
    Write-Host "`n=== VERIFICACIÓN DE ARCHIVOS DEL PROYECTO ===" -ForegroundColor Cyan
    Write-Host ""
    
    $archivosRequeridos = @(
        "index.html",
        "api.php",
        "README.md",
        "html\alumnos.html",
        "html\pruebas.html",
        "html\estadisticas.html",
        "css\styles_new.css",
        "js\script.js",
        "js\alumnos.js",
        "js\pruebas.js",
        "js\estadisticas.js",
        "database\db_alumnoss_complete.sql",
        "scripts\preparar_entrega.ps1"
    )
    
    $archivosDocumentacion = @(
        "docs\INSTALL.md",
        "docs\CONSULTAS.md",
        "docs\DOCUMENTO_TECNICO.md",
        "docs\SCREENSHOTS.md",
        "docs\GUIA_EMPAQUETADO.md"
    )
    
    $faltantes = @()
    
    Write-Host "Archivos de código fuente:" -ForegroundColor Yellow
    foreach ($archivo in $archivosRequeridos) {
        $ruta = Join-Path $proyectoPath $archivo
        if (Test-Path $ruta) {
            Write-Host "  ✓ $archivo" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $archivo (FALTA)" -ForegroundColor Red
            $faltantes += $archivo
        }
    }
    
    Write-Host "`nArchivos de documentación:" -ForegroundColor Yellow
    foreach ($archivo in $archivosDocumentacion) {
        $ruta = Join-Path $proyectoPath $archivo
        if (Test-Path $ruta) {
            Write-Host "  ✓ $archivo" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $archivo (FALTA)" -ForegroundColor Red
            $faltantes += $archivo
        }
    }
    
    Write-Host "`nCarpeta de screenshots:" -ForegroundColor Yellow
    $screenshotsPath = Join-Path $proyectoPath "docs\screenshots"
    if (Test-Path $screenshotsPath) {
        $screenshots = Get-ChildItem $screenshotsPath -Filter "*.png" -ErrorAction SilentlyContinue
        $count = $screenshots.Count
        if ($count -ge 10) {
            Write-Host "  ✓ $count screenshots encontrados (mínimo 10 requeridos)" -ForegroundColor Green
        } elseif ($count -gt 0) {
            Write-Host "  ⚠ $count screenshots encontrados (se recomiendan mínimo 10)" -ForegroundColor Yellow
        } else {
            Write-Host "  ✗ No hay screenshots capturados" -ForegroundColor Red
            Write-Host "    Usa la opción 5 para abrir la carpeta y capturar pantallas" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠ Carpeta screenshots no existe" -ForegroundColor Yellow
    }
    
    if ($faltantes.Count -gt 0) {
        Write-Host "`n⚠️ ATENCIÓN: Faltan $($faltantes.Count) archivos" -ForegroundColor Red
        Write-Host "Archivos faltantes: $($faltantes -join ', ')" -ForegroundColor Red
    } else {
        Write-Host "`n✅ Todos los archivos requeridos están presentes" -ForegroundColor Green
    }
    
    Write-Host ""
    Read-Host "Presiona ENTER para continuar"
}

# Función 2: Crear estructura de carpetas
function Create-FolderStructure {
    Write-Host "`n=== CREANDO ESTRUCTURA DE CARPETAS ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Crear carpeta principal
    if (Test-Path $rutaEntrega) {
        Write-Host "⚠️ La carpeta de entrega ya existe. ¿Deseas recrearla?" -ForegroundColor Yellow
        Write-Host "   Esto eliminará el contenido actual." -ForegroundColor Yellow
        $respuesta = Read-Host "Escribir 'SI' para confirmar"
        if ($respuesta -eq "SI") {
            Remove-Item $rutaEntrega -Recurse -Force
            Write-Host "✓ Carpeta anterior eliminada" -ForegroundColor Green
        } else {
            Write-Host "✗ Operación cancelada" -ForegroundColor Red
            Read-Host "Presiona ENTER para continuar"
            return
        }
    }
    
    Write-Host "Creando carpetas..." -ForegroundColor Yellow
    
    New-Item -Path $rutaEntrega -ItemType Directory -Force | Out-Null
    New-Item -Path "$rutaEntrega\src" -ItemType Directory -Force | Out-Null
    New-Item -Path "$rutaEntrega\docs" -ItemType Directory -Force | Out-Null
    New-Item -Path "$rutaEntrega\screenshots" -ItemType Directory -Force | Out-Null
    
    Write-Host "✅ Estructura de carpetas creada en:" -ForegroundColor Green
    Write-Host "   $rutaEntrega" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Estructura:" -ForegroundColor Yellow
    Write-Host "  $carpetaEntrega/" -ForegroundColor White
    Write-Host "  ├── src/" -ForegroundColor White
    Write-Host "  ├── docs/" -ForegroundColor White
    Write-Host "  ├── screenshots/" -ForegroundColor White
    Write-Host "  ├── README.md" -ForegroundColor White
    Write-Host "  └── db_alumnoss_complete.sql" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona ENTER para continuar"
}

# Función 3: Copiar archivos
function Copy-FilesToDelivery {
    Write-Host "`n=== COPIANDO ARCHIVOS A CARPETA DE ENTREGA ===" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $rutaEntrega)) {
        Write-Host "✗ La carpeta de entrega no existe. Ejecuta primero la opción 2." -ForegroundColor Red
        Read-Host "Presiona ENTER para continuar"
        return
    }
    
    # Copiar archivos de código a src/
    Write-Host "Copiando archivos de código fuente..." -ForegroundColor Yellow
    
    # Copiar archivos raíz (index.html y api.php)
    $archivosRaiz = @("index.html", "api.php")
    foreach ($archivo in $archivosRaiz) {
        $origen = Join-Path $proyectoPath $archivo
        $destino = Join-Path "$rutaEntrega\src" $archivo
        if (Test-Path $origen) {
            Copy-Item $origen $destino -Force
            Write-Host "  ✓ $archivo" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $archivo (no encontrado)" -ForegroundColor Red
        }
    }
    
    # Copiar carpetas html/, css/, js/ completas
    $carpetas = @("html", "css", "js")
    foreach ($carpeta in $carpetas) {
        $origenCarpeta = Join-Path $proyectoPath $carpeta
        $destinoCarpeta = Join-Path "$rutaEntrega\src" $carpeta
        if (Test-Path $origenCarpeta) {
            Copy-Item $origenCarpeta $destinoCarpeta -Recurse -Force
            Write-Host "  ✓ $carpeta/ (carpeta completa)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $carpeta/ (carpeta no encontrada)" -ForegroundColor Red
        }
    }
    
    # Copiar archivos raíz
    Write-Host "`nCopiando archivos de raíz..." -ForegroundColor Yellow
    Copy-Item (Join-Path $proyectoPath "README.md") $rutaEntrega -Force
    Write-Host "  ✓ README.md" -ForegroundColor Green
    Copy-Item (Join-Path $proyectoPath "db_alumnoss_complete.sql") $rutaEntrega -Force
    Write-Host "  ✓ db_alumnoss_complete.sql" -ForegroundColor Green
    
    # Copiar documentación a docs/
    Write-Host "`nCopiando documentación..." -ForegroundColor Yellow
    $archivosDocs = @(
        "INSTALL.md",
        "CONSULTAS.md",
        "DOCUMENTO_TECNICO.md",
        "SCREENSHOTS.md",
        "GUIA_EMPAQUETADO.md"
    )
    
    foreach ($archivo in $archivosDocs) {
        $origen = Join-Path $proyectoPath "docs\$archivo"
        $destino = Join-Path "$rutaEntrega\docs" $archivo
        if (Test-Path $origen) {
            Copy-Item $origen $destino -Force
            Write-Host "  ✓ $archivo" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $archivo (no encontrado)" -ForegroundColor Red
        }
    }
    
    # Copiar PDF si existe
    $pdfPath = Join-Path $proyectoPath "docs\DOCUMENTO_TECNICO.pdf"
    if (Test-Path $pdfPath) {
        Copy-Item $pdfPath (Join-Path "$rutaEntrega\docs" "DOCUMENTO_TECNICO.pdf") -Force
        Write-Host "  ✓ DOCUMENTO_TECNICO.pdf" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ DOCUMENTO_TECNICO.pdf no encontrado (debes convertirlo desde MD)" -ForegroundColor Yellow
    }
    
    # Copiar screenshots
    Write-Host "`nCopiando screenshots..." -ForegroundColor Yellow
    $screenshotsOrigen = Join-Path $proyectoPath "docs\screenshots"
    if (Test-Path $screenshotsOrigen) {
        $screenshots = Get-ChildItem $screenshotsOrigen -Filter "*.png" -ErrorAction SilentlyContinue
        if ($screenshots.Count -gt 0) {
            foreach ($screenshot in $screenshots) {
                Copy-Item $screenshot.FullName (Join-Path "$rutaEntrega\screenshots" $screenshot.Name) -Force
            }
            Write-Host "  ✓ $($screenshots.Count) screenshots copiados" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ No hay screenshots para copiar" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠ Carpeta de screenshots no existe" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ Archivos copiados exitosamente" -ForegroundColor Green
    Write-Host ""
    Read-Host "Presiona ENTER para continuar"
}

# Función 4: Verificar carpeta de entrega
function Verify-DeliveryFolder {
    Write-Host "`n=== VERIFICACIÓN DE CARPETA DE ENTREGA ===" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $rutaEntrega)) {
        Write-Host "✗ La carpeta de entrega no existe." -ForegroundColor Red
        Read-Host "Presiona ENTER para continuar"
        return
    }
    
    Write-Host "Ubicación: $rutaEntrega" -ForegroundColor Gray
    Write-Host ""
    
    # Contar archivos en cada carpeta
    $srcCount = (Get-ChildItem "$rutaEntrega\src" -File -ErrorAction SilentlyContinue).Count
    $docsCount = (Get-ChildItem "$rutaEntrega\docs" -File -ErrorAction SilentlyContinue).Count
    $screenshotsCount = (Get-ChildItem "$rutaEntrega\screenshots" -File -ErrorAction SilentlyContinue).Count
    $rootCount = (Get-ChildItem $rutaEntrega -File -ErrorAction SilentlyContinue).Count
    
    Write-Host "Archivos en src/: $srcCount" -ForegroundColor $(if ($srcCount -ge 10) { "Green" } else { "Yellow" })
    Write-Host "Archivos en docs/: $docsCount" -ForegroundColor $(if ($docsCount -ge 5) { "Green" } else { "Yellow" })
    Write-Host "Screenshots: $screenshotsCount" -ForegroundColor $(if ($screenshotsCount -ge 10) { "Green" } else { "Yellow" })
    Write-Host "Archivos raíz: $rootCount" -ForegroundColor $(if ($rootCount -ge 2) { "Green" } else { "Yellow" })
    
    Write-Host "`nListado de archivos:" -ForegroundColor Yellow
    Write-Host "`nRaíz:" -ForegroundColor Cyan
    Get-ChildItem $rutaEntrega -File | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    
    Write-Host "`nsrc/:" -ForegroundColor Cyan
    Get-ChildItem "$rutaEntrega\src" -File | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    
    Write-Host "`ndocs/:" -ForegroundColor Cyan
    Get-ChildItem "$rutaEntrega\docs" -File | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    
    Write-Host "`nscreenshots/:" -ForegroundColor Cyan
    $screenshots = Get-ChildItem "$rutaEntrega\screenshots" -File -ErrorAction SilentlyContinue
    if ($screenshots.Count -gt 0) {
        $screenshots | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    } else {
        Write-Host "  (vacía)" -ForegroundColor Gray
    }
    
    # Calcular tamaño total
    $tamañoTotal = (Get-ChildItem $rutaEntrega -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "`nTamaño total: $([math]::Round($tamañoTotal, 2)) MB" -ForegroundColor Yellow
    
    Write-Host ""
    Read-Host "Presiona ENTER para continuar"
}

# Función 5: Abrir carpeta de screenshots
function Open-ScreenshotsFolder {
    Write-Host "`n=== ABRIR CARPETA DE SCREENSHOTS ===" -ForegroundColor Cyan
    Write-Host ""
    
    $screenshotsPath = Join-Path $proyectoPath "docs\screenshots"
    
    if (-not (Test-Path $screenshotsPath)) {
        Write-Host "⚠️ Creando carpeta de screenshots..." -ForegroundColor Yellow
        New-Item -Path $screenshotsPath -ItemType Directory -Force | Out-Null
    }
    
    Write-Host "✓ Abriendo carpeta de screenshots..." -ForegroundColor Green
    Write-Host "  $screenshotsPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📷 INSTRUCCIONES:" -ForegroundColor Cyan
    Write-Host "1. Abre el sistema en tu navegador: http://localhost/alumnos_academico_app/" -ForegroundColor White
    Write-Host "2. Usa Windows + Shift + S para capturar pantallas" -ForegroundColor White
    Write-Host "3. Guarda las capturas en la carpeta que se abrirá" -ForegroundColor White
    Write-Host "4. Consulta SCREENSHOTS.md para ver qué capturas necesitas" -ForegroundColor White
    Write-Host ""
    Write-Host "Mínimo requerido: 10 capturas esenciales" -ForegroundColor Yellow
    Write-Host "Recomendado: 15 capturas completas" -ForegroundColor Green
    Write-Host ""
    
    Start-Process "explorer.exe" $screenshotsPath
    
    # Abrir guía de screenshots
    $guiaPath = Join-Path $proyectoPath "docs\SCREENSHOTS.md"
    if (Test-Path $guiaPath) {
        $respuesta = Read-Host "¿Deseas abrir la guía SCREENSHOTS.md? (S/N)"
        if ($respuesta -eq "S" -or $respuesta -eq "s") {
            Start-Process "notepad.exe" $guiaPath
        }
    }
    
    Read-Host "Presiona ENTER cuando hayas terminado de capturar"
}

# Función 6: Comprimir proyecto
function Compress-Project {
    Write-Host "`n=== COMPRIMIR PROYECTO PARA ENTREGA ===" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $rutaEntrega)) {
        Write-Host "✗ La carpeta de entrega no existe. Ejecuta primero las opciones 2 y 3." -ForegroundColor Red
        Read-Host "Presiona ENTER para continuar"
        return
    }
    
    $archivoZip = Join-Path $escritorio "$carpetaEntrega.zip"
    
    # Verificar si ya existe
    if (Test-Path $archivoZip) {
        Write-Host "⚠️ El archivo $carpetaEntrega.zip ya existe. ¿Deseas reemplazarlo? (S/N)" -ForegroundColor Yellow
        $respuesta = Read-Host
        if ($respuesta -ne "S" -and $respuesta -ne "s") {
            Write-Host "✗ Operación cancelada" -ForegroundColor Red
            Read-Host "Presiona ENTER para continuar"
            return
        }
        Remove-Item $archivoZip -Force
    }
    
    Write-Host "Comprimiendo proyecto..." -ForegroundColor Yellow
    Write-Host "Esto puede tomar unos segundos..." -ForegroundColor Gray
    Write-Host ""
    
    try {
        Compress-Archive -Path $rutaEntrega -DestinationPath $archivoZip -Force
        
        $tamañoZip = (Get-Item $archivoZip).Length / 1MB
        
        Write-Host "✅ ¡Proyecto comprimido exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Archivo creado: $archivoZip" -ForegroundColor White
        Write-Host "Tamaño: $([math]::Round($tamañoZip, 2)) MB" -ForegroundColor White
        Write-Host ""
        
        if ($tamañoZip -gt 50) {
            Write-Host "⚠️ ATENCIÓN: El archivo es mayor a 50 MB" -ForegroundColor Yellow
            Write-Host "   Verifica que no haya archivos innecesarios" -ForegroundColor Yellow
        } else {
            Write-Host "✓ Tamaño apropiado para entrega" -ForegroundColor Green
        }
        
        Write-Host ""
        $respuesta = Read-Host "¿Deseas abrir la carpeta donde está el ZIP? (S/N)"
        if ($respuesta -eq "S" -or $respuesta -eq "s") {
            Start-Process "explorer.exe" "/select,$archivoZip"
        }
    } catch {
        Write-Host "✗ Error al comprimir: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Presiona ENTER para continuar"
}

# Función 7: Ejecutar TODO
function Execute-All {
    Write-Host "`n=== EJECUTAR PROCESO COMPLETO ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Se ejecutarán los siguientes pasos:" -ForegroundColor Yellow
    Write-Host "1. Crear estructura de carpetas" -ForegroundColor White
    Write-Host "2. Copiar archivos" -ForegroundColor White
    Write-Host "3. Verificar carpeta de entrega" -ForegroundColor White
    Write-Host "4. Abrir carpeta de screenshots (para que captures)" -ForegroundColor White
    Write-Host "5. Comprimir proyecto" -ForegroundColor White
    Write-Host ""
    $respuesta = Read-Host "¿Continuar? (S/N)"
    
    if ($respuesta -ne "S" -and $respuesta -ne "s") {
        Write-Host "✗ Operación cancelada" -ForegroundColor Red
        Read-Host "Presiona ENTER para continuar"
        return
    }
    
    # Paso 1
    Create-FolderStructure
    
    # Paso 2
    Copy-FilesToDelivery
    
    # Paso 3
    Verify-DeliveryFolder
    
    # Paso 4
    Write-Host "`n⚠️ PAUSA: Captura de Screenshots" -ForegroundColor Yellow
    Write-Host "Ahora debes capturar las pantallas del sistema." -ForegroundColor White
    Write-Host "Presiona ENTER para abrir la carpeta de screenshots..." -ForegroundColor White
    Read-Host
    Open-ScreenshotsFolder
    
    # Copiar screenshots nuevamente
    Write-Host "`nCopiando screenshots a carpeta de entrega..." -ForegroundColor Yellow
    $screenshotsOrigen = Join-Path $proyectoPath "docs\screenshots"
    $screenshots = Get-ChildItem $screenshotsOrigen -Filter "*.png" -ErrorAction SilentlyContinue
    if ($screenshots.Count -gt 0) {
        foreach ($screenshot in $screenshots) {
            Copy-Item $screenshot.FullName (Join-Path "$rutaEntrega\screenshots" $screenshot.Name) -Force
        }
        Write-Host "✓ $($screenshots.Count) screenshots copiados" -ForegroundColor Green
    }
    
    # Paso 5
    Write-Host "`n⚠️ RECORDATORIO: ¿Convertiste DOCUMENTO_TECNICO.md a PDF?" -ForegroundColor Yellow
    Write-Host "Si no lo has hecho, cancela ahora y conviértelo primero." -ForegroundColor White
    $respuesta = Read-Host "¿Ya tienes el PDF? (S/N)"
    if ($respuesta -ne "S" -and $respuesta -ne "s") {
        Write-Host "✗ Completa la conversión a PDF y luego ejecuta la opción 6 para comprimir" -ForegroundColor Red
        Read-Host "Presiona ENTER para continuar"
        return
    }
    
    Compress-Project
    
    Write-Host "`n=========================================" -ForegroundColor Green
    Write-Host "  ✅ PROCESO COMPLETO FINALIZADO       " -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu proyecto está listo para entregar en:" -ForegroundColor White
    Write-Host "$escritorio\$carpetaEntrega.zip" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Presiona ENTER para volver al menú"
}

# Bucle principal del menú
do {
    Show-Menu
    $opcion = Read-Host "Selecciona una opción (1-8)"
    
    switch ($opcion) {
        "1" { Verify-ProjectFiles }
        "2" { Create-FolderStructure }
        "3" { Copy-FilesToDelivery }
        "4" { Verify-DeliveryFolder }
        "5" { Open-ScreenshotsFolder }
        "6" { Compress-Project }
        "7" { Execute-All }
        "8" { 
            Write-Host "`n¡Hasta luego! 👋" -ForegroundColor Cyan
            break 
        }
        default { 
            Write-Host "`n✗ Opción inválida. Intenta nuevamente." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($opcion -ne "8")
