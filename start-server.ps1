# =========================================================
# Zain Cash Customer Care Academy & AI Training System Launcher
# =========================================================
$port = 8888
$folder = $PSScriptRoot
Set-Location $folder

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -ne "WellKnown" -and $_.InterfaceAlias -notlike "*Loopback*" } | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Zain Cash Customer Care Academy & AI System" -ForegroundColor Green
Write-Host "  Enterprise Node.js + SQLite WAL + WebSockets Engine" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Local Access:  http://localhost:$port" -ForegroundColor White
Write-Host "  Team Access:   http://${localIP}:$port" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:$port"
node server.js