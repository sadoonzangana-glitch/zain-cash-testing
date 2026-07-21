$port = 8888
$folder = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
try {
    $listener.Prefixes.Add("http://+:$port/")
    $listener.Start()
} catch {
    Write-Host "Wildcard binding failed. Trying localhost only..." -ForegroundColor Yellow
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    try {
        $listener.Start()
        Write-Host "Server started on localhost!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Could not start server. Run PowerShell as Administrator." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit
    }
}

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -ne "WellKnown" -and $_.InterfaceAlias -notlike "*Loopback*" } | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " ZainCash Customer Care System" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Local:  http://localhost:$port" -ForegroundColor White
Write-Host " Team:   http://${localIP}:$port" -ForegroundColor Cyan
Write-Host " Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".json" = "application/json; charset=utf-8"
}

# Start Node.js API server on port 9999
$nodeApiPath = Join-Path $folder "api-server.js"
$nodeProc = $null
if (Test-Path $nodeApiPath) {
    Write-Host " Starting Node.js API server..." -ForegroundColor Yellow
    $nodeProc = Start-Process -FilePath "node" -ArgumentList "`"$nodeApiPath`"" -WorkingDirectory $folder -PassThru -WindowStyle Hidden
    Start-Sleep -Milliseconds 1000
    Write-Host " API server ready (PID: $($nodeProc.Id))" -ForegroundColor Green
} else {
    Write-Host " WARNING: api-server.js not found!" -ForegroundColor Red
}

Write-Host ""

# Main request loop
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
    } catch {
        break
    }
    $request  = $context.Request
    $response = $context.Response
    $rawPath  = $request.Url.LocalPath

    # Proxy all /api/ calls to Node.js on port 9999
    if ($rawPath.StartsWith("/api/")) {
        try {
            $queryString = $request.Url.Query
            $nodeUrl = "http://127.0.0.1:9999$rawPath$queryString"
            $webReq = [System.Net.WebRequest]::Create($nodeUrl)
            $webReq.Method = $request.HttpMethod
            $webReq.ContentType = "application/json"
            $webReq.Timeout = 8000

            if ($request.HttpMethod -eq "POST" -or $request.HttpMethod -eq "PUT") {
                $rdr = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $bodyTxt = $rdr.ReadToEnd()
                $rdr.Close()
                $bodyB = [System.Text.Encoding]::UTF8.GetBytes($bodyTxt)
                $webReq.ContentLength = $bodyB.Length
                $ws = $webReq.GetRequestStream()
                $ws.Write($bodyB, 0, $bodyB.Length)
                $ws.Close()
            } else {
                $webReq.ContentLength = 0
            }

            $nodeResp = $null
            try {
                $nodeResp = $webReq.GetResponse()
                $response.StatusCode = [int]$nodeResp.StatusCode
            } catch [System.Net.WebException] {
                $nodeResp = $_.Exception.Response
                if ($nodeResp) { $response.StatusCode = [int]$nodeResp.StatusCode }
                else {
                    $response.StatusCode = 503
                    $errB = [System.Text.Encoding]::UTF8.GetBytes('{"error":"API server unavailable"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($errB, 0, $errB.Length)
                    $response.OutputStream.Close()
                    continue
                }
            }

            $ns = $nodeResp.GetResponseStream()
            $nr = New-Object System.IO.StreamReader($ns, [System.Text.Encoding]::UTF8)
            $nodeBody = $nr.ReadToEnd()
            $nr.Close()
            $nodeResp.Close()

            $response.ContentType = "application/json; charset=utf-8"
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, X-User-Role, X-User-Id")
            $rb = [System.Text.Encoding]::UTF8.GetBytes($nodeBody)
            $response.ContentLength64 = $rb.Length
            $response.OutputStream.Write($rb, 0, $rb.Length)
            $response.OutputStream.Close()
            continue
        } catch {
            $response.StatusCode = 500
            $response.ContentType = "application/json; charset=utf-8"
            $eb = [System.Text.Encoding]::UTF8.GetBytes("{`"error`":`"Proxy error`"}")
            $response.OutputStream.Write($eb, 0, $eb.Length)
            $response.OutputStream.Close()
            continue
        }
    }

    # Serve static files
    if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }
    $filePath = Join-Path $folder ($rawPath.TrimStart("/").Replace("/", "\"))

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $ct  = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $fc  = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $ct
        $response.ContentLength64 = $fc.Length
        $response.OutputStream.Write($fc, 0, $fc.Length)
        Write-Host "[OK]  $rawPath" -ForegroundColor DarkGray
    } else {
        $response.StatusCode = 404
        Write-Host "[404] $rawPath" -ForegroundColor Red
    }
    $response.OutputStream.Close()
}

# Cleanup
if ($nodeProc -and -not $nodeProc.HasExited) {
    $nodeProc.Kill()
    Write-Host "Node.js API server stopped." -ForegroundColor Gray
}