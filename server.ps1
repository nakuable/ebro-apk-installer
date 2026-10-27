$port = 8085
$maxPort = 8090
$folder = $PSScriptRoot
if (-not $folder) { $folder = "c:\Users\fgg\Desktop\ebro\ebro-web-installer" }

$listener = $null
while ($port -le $maxPort) {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$port/")
        try { $listener.Prefixes.Add("http://127.0.0.1:$port/") } catch {}
        $listener.Start()
        break
    } catch {
        if ($listener) { try { $listener.Close() } catch {} }
        $listener = $null
        $port++
    }
}

if (-not $listener) {
    Write-Host "Error: No se pudo abrir un puerto local entre 8085 y $maxPort." -ForegroundColor Red
    pause
    exit 1
}

$url = "http://localhost:$port/"
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  🚗 EBRO S700 & Desay SV | WebUSB Sideload Hub" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Servidor local iniciado con exito." -ForegroundColor Green
Write-Host "Abriendo en el navegador: $url" -ForegroundColor Yellow
Write-Host "(Mantén esta ventana abierta mientras utilices la herramienta)" -ForegroundColor Gray
Write-Host ""

# Abrir el navegador automáticamente
try {
    Start-Process $url
} catch {}

function Find-AdbExe {
    $paths = @(
        "C:\Users\fgg\Desktop\ebro\platform-tools\adb.exe",
        "C:\Users\fgg\Desktop\ebro\magic_sqd-main\tools\adb.exe",
        "platform-tools\adb.exe",
        "tools\adb.exe"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    $cmd = Get-Command adb -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    return $null
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $localPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        
        # Cabeceras CORS
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # API: GET /api/adb/status
        if ($localPath -eq "/api/adb/status" -and $request.HttpMethod -eq "GET") {
            $adbExe = Find-AdbExe
            $adbProc = Get-Process -Name adb -ErrorAction SilentlyContinue
            $resObj = @{ available = ($adbExe -ne $null); adbPath = $adbExe; devices = @() }
            if ($adbExe) {
                try {
                    $out = & $adbExe devices -l 2>&1 | Out-String
                    $lines = $out -split "`r?`n"
                    $devs = @()
                    foreach ($line in $lines) {
                        $trim = $line.Trim()
                        if ($trim -and -not $trim.StartsWith("List") -and -not $trim.StartsWith("*")) {
                            $parts = -split $trim
                            if ($parts.Length -ge 2 -and $parts[1] -eq "device") {
                                $serial = $parts[0]
                                $model = "DesaySV"
                                $product = "g7ph_t22_int"
                                foreach ($p in $parts) {
                                    if ($p.StartsWith("model:")) { $model = $p.Substring(6).Replace("_", " ") }
                                    if ($p.StartsWith("product:")) { $product = $p.Substring(8) }
                                }
                                $devs += @{ serial = $serial; model = $model; product = $product }
                            }
                        }
                    }
                    $resObj.devices = $devs
                } catch {}
            }
            $json = ConvertTo-Json $resObj
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # API: POST /api/adb/shell
        if ($localPath -eq "/api/adb/shell" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $reqData = ConvertFrom-Json $body
            $cmd = $reqData.cmd
            $serial = $reqData.serial

            $adbExe = Find-AdbExe
            if (-not $adbExe) {
                $errObj = @{ error = "adb.exe no encontrado en el sistema" }
                $json = ConvertTo-Json $errObj
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.StatusCode = 500
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            $args = @()
            if ($serial) { $args += "-s", $serial }
            $args += "shell", $cmd

            $output = & $adbExe $args 2>&1 | Out-String
            $resObj = @{ output = $output; exitCode = $LASTEXITCODE }
            $json = ConvertTo-Json $resObj
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # API: POST /api/adb/push
        if ($localPath -eq "/api/adb/push" -and $request.HttpMethod -eq "POST") {
            $dest = $request.QueryString["dest"]
            if (-not $dest) { $dest = "/data/local/tmp/upload.apk" }
            $serial = $request.QueryString["serial"]
            $tempFile = [System.IO.Path]::GetTempFileName()
            $fs = [System.IO.File]::Create($tempFile)
            $request.InputStream.CopyTo($fs)
            $fs.Close()

            $adbExe = Find-AdbExe
            $args = @()
            if ($serial) { $args += "-s", $serial }
            $args += "push", $tempFile, $dest

            $output = & $adbExe $args 2>&1 | Out-String
            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue

            $resObj = @{ success = ($LASTEXITCODE -eq 0); output = $output }
            $json = ConvertTo-Json $resObj
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # API: POST /api/adb/kill
        if ($localPath -eq "/api/adb/kill" -and $request.HttpMethod -eq "POST") {
            $adbExe = Find-AdbExe
            if ($adbExe) {
                try {
                    Start-Process -FilePath $adbExe -ArgumentList "kill-server" -NoNewWindow -Wait -ErrorAction SilentlyContinue
                } catch {}
            }
            Get-Process -Name adb -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
            $resObj = @{ success = $true; message = "ADB server detenido. Puerto USB liberado para WebUSB." }
            $json = ConvertTo-Json $resObj
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # Servidor de archivos estáticos
        $relPath = $localPath
        if ($relPath -eq "/" -or $relPath -eq "") { $relPath = "/index.html" }
        $filePath = Join-Path $folder ($relPath.TrimStart("/").Replace("/", "\"))
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".mjs"  { $response.ContentType = "application/javascript; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".dex"  { $response.ContentType = "application/octet-stream" }
                ".apk"  { $response.ContentType = "application/vnd.android.package-archive" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".png"  { $response.ContentType = "image/png" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("Archivo no encontrado: $localPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Ignorar errores de socket interrumpido
    }
}
