$port = 8888
$folder = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
try {
    $listener.Prefixes.Add("http://+:$port/")
    $listener.Start()
} catch {
    Write-Host "Wildcard binding failed. Trying to start server on localhost only..." -ForegroundColor Yellow
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    try {
        $listener.Start()
        Write-Host "Server started successfully on localhost!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Could not start server. Run PowerShell as Administrator." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit
    }
}

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -ne "WellKnown" -and $_.InterfaceAlias -notlike "*Loopback*" } | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host " Server is running! Share with your team" -ForegroundColor Green
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host ""
Write-Host " Local (this machine):" -ForegroundColor Yellow
Write-Host "   http://localhost:$port" -ForegroundColor White
Write-Host ""
Write-Host " Team link (same WiFi network):" -ForegroundColor Yellow
Write-Host "   http://${localIP}:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host " Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "========================================"  -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
}

$defaultUsers = @(
    [PSCustomObject]@{ id = "ZC262"; name = "Sadoon Muhsin"; role = "Inbound"; email = "sadoon.mohsoun@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC000"; name = "Amr Nasr"; role = "Admin" }
    [PSCustomObject]@{ id = "ZC700"; name = "Kadhim Mohammed Safi"; role = "Inbound"; email = "kadhim.mohammed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC476"; name = "Mustafa Khudhaier Abbas"; role = "Inbound"; email = "mustafa.khudher@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC552"; name = "Aso Sarbest Nathmi"; role = "Inbound"; email = "aso.sarbast@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC733"; name = "Tara faris fouad"; role = "Inbound"; email = "tara.faris@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC580"; name = "Hayman Omed Mohammed"; role = "Inbound"; email = "hemn.omed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC624"; name = "Ruqaya Nadhim"; role = "Inbound"; email = "ruqaya.nadhum@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC739"; name = "Ahmed Khalil Fatah"; role = "Inbound"; email = "ahmed.fatah@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC737"; name = "Dheyaa Mohammed Khudhair"; role = "Inbound"; email = "dhyaa.mohammed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC639"; name = "Mustafa Abdulsahib Najim"; role = "Inbound"; email = "mustafa.abdulsahib@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC500"; name = "Omar Fadhil Sleman"; role = "Inbound"; email = "omar.fadhil@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC291"; name = "Ali Mohammed Ameen"; role = "Inbound"; email = "ali.ameen@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC672"; name = "Mustafa Ahmed Khadir"; role = "Inbound"; email = "mustafa.ahmed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC627"; name = "Abdullah Loay"; role = "Inbound"; email = "abdullah.loay@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC735"; name = "MOHAMMED RAGHEED HAMID"; role = "Inbound"; email = "mohammed.raghed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC743"; name = "Ali Shakir Eand"; role = "Inbound"; email = "ali.shakir@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC311"; name = "Ahmed AbdulRazaq Hameed"; role = "Inbound"; email = "ahmed.abdulrazaq@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC703"; name = "Houthaifa Waleed Razuki"; role = "Inbound"; email = "houthaifa.waleed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC657"; name = "Maytham Ali Mohammed"; role = "Inbound"; email = "maytham.ali@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC738"; name = "Hazem Emad Hamdi"; role = "Inbound"; email = "hazem.emad@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC655"; name = "Muhammad Zaman"; role = "Inbound"; email = "mohammed.zaman@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC683"; name = "Ali Ryadh Hadi"; role = "Inbound"; email = "ali.riyadh@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC681"; name = "Alaa Hussein Ali"; role = "Inbound"; email = "alaa.hussein@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC740"; name = "Ali Wisam Abdulsattar"; role = "Inbound"; email = "ali.wisam@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC332"; name = "Monier Yasir Monier"; role = "Inbound"; email = "monier.yasir@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC579"; name = "Ahmed Haitham Kadhim"; role = "Inbound"; email = "ahmad.haitham@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC416"; name = "Nooralhuda Ali Hamza"; role = "Inbound"; email = "nooralhuda.ali@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC676"; name = "Hamza Dhiaa Mubder"; role = "Inbound"; email = "hamza.dhiaa@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC741"; name = "Montzer Muneer Taha"; role = "Inbound"; email = "montadhar.monier@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC501"; name = "Hussein Mohammed Ibrahim"; role = "Inbound"; email = "hussein.mohammed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC578"; name = "Maryam Thaer Talib"; role = "Inbound"; email = "maryam.thaer@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC577"; name = "Hasan Ammar sabir"; role = "Inbound"; email = "hasan.ammar@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC194"; name = "Haneen Ahmed Zaki"; role = "Inbound"; email = "haneen.ahmed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC673"; name = "Forqan Zuhaer Mohamed"; role = "Inbound"; email = "forqan.zuhaer@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC706"; name = "Mustafa laith sophi"; role = "Inbound"; email = "mustafa.laith@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC532"; name = "Maryam Tariq Jassam"; role = "Inbound"; email = "maryam.tariq@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC744"; name = "Abdullah Faris Barghash"; role = "Inbound"; email = "abdullah.faris@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC489"; name = "Sarah Ahmed Abd"; role = "Inbound"; email = "sarah.ahmed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC485"; name = "Ahmed Saad Abdulhadi"; role = "Inbound"; email = "ahmad.saad@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC366"; name = "Sajjad Mahdi"; role = "Inbound"; email = "sajad.mahdi@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC434"; name = "Aya Ali Hussien"; role = "Inbound"; email = "aya.ali@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC224"; name = "Ali Sabeh Jassim"; role = "Inbound"; email = "ali.sabeeh@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC473"; name = "Zainab Saad faeq"; role = "Inbound"; email = "zainab.saad@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC742"; name = "Rahma Dored Jumaa"; role = "Inbound"; email = "rahma.duraid@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC625"; name = "Ahmed Mohammed Khalil"; role = "Inbound"; email = "ahmed.khalil@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC609"; name = "Ali Mohammed Sallal"; role = "Inbound"; email = "ali.mohammed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC363"; name = "Mohammed Asaad"; role = "Inbound"; email = "mohammed.asaad@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC582"; name = "Maryam Ahmed Younis"; role = "Inbound"; email = "maryam.younis@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC471"; name = "Dalia Salah Tayah"; role = "Inbound"; email = "dalia.salah@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC480"; name = "Abdullah Abdulrahman Wahib"; role = "Inbound"; email = "abdullah.abdalrhman@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC702"; name = "Abdullah Majid Hameed."; role = "Inbound"; email = "abdullah.majid@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC646"; name = "Yassir Khalil Qahtan"; role = "Inbound"; email = "yassir.khalil@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC315"; name = "Mustafa Muwafaq Mohammedali"; role = "Inbound"; email = "mustafa.muwafaq@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC576"; name = "Zaid Ahmed abbas"; role = "Inbound"; email = "zaid.ahmed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC755"; name = "Ibrahim Khalil Samir"; role = "Inbound"; email = "ibrahim.khalil@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC565"; name = "Mohammed Waleed Mohammed"; role = "Inbound"; email = "mohammed.waleed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC734"; name = "Ali Abbas Rahman"; role = "Inbound"; email = "ali.abbas@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC643"; name = "Mohammedalbaqir Haider Hussein"; role = "Inbound"; email = "mohammed.albaqer@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC758"; name = "Nabaa Ali Mohhamed"; role = "Inbound"; email = "nabaa.ali@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC470"; name = "Yaqeen Abdulkhdhur Hasan"; role = "Inbound"; email = "yakeen.abdulkhudhur@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC482"; name = "Zainab Haider Jaffar"; role = "Inbound"; email = "zainab.haider@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC272"; name = "Hasan Reyad Jabbar"; role = "Inbound"; email = "hassan.reyad@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC757"; name = "Amna Dheyaa Hasan"; role = "Inbound"; email = "amna.dheyaa@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC745"; name = "Abdul Razaq Haitham Mohsen"; role = "Inbound"; email = "abdulrazaq.haitham@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC481"; name = "Yusor Raied Ismail"; role = "Inbound"; email = "yusor.raed@zaincash.iq" }
    [PSCustomObject]@{ id = "ZC699"; name = "Ameen saad nasef"; role = "Inbound"; email = "ameen.saad@zaincash.iq" }
)

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $rawPath = $request.Url.LocalPath

    # Intercept API calls
    if ($rawPath.StartsWith("/api/")) {
        $response.ContentType = "application/json; charset=utf-8"
        # Enable CORS
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }
        
        $dbPath = Join-Path $folder "db.json"
        # Initialize db.json if not exists
        if (-not (Test-Path $dbPath)) {
            $initialDb = @{
                users = $defaultUsers
                assignments = @()
                results = @()
                scenarios = $null
                aiResults = @()
            }
            $initialDb | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
        }
        
        $db = Get-Content $dbPath -Raw | ConvertFrom-Json
        
        if ($rawPath -eq "/api/login" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()
            
            $bodyObj = ConvertFrom-Json $body
            $zcCode = $bodyObj.username.Trim().ToUpper()
            
            # Simple login validation: check if ID or Name matches (ignoring case)
            $user = $db.users | Where-Object { $_.id.ToUpper() -eq $zcCode -or $_.name.ToUpper() -eq $zcCode }
            if ($user) {
                $resJson = $user | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            } else {
                $errorJson = @{ error = "Employee code not registered" } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($errorJson)
                $response.StatusCode = 401
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/users" -and $request.HttpMethod -eq "GET") {
            $resJson = $db.users | ConvertTo-Json -Depth 100
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
            $response.StatusCode = 200
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
        }
        elseif ($rawPath -eq "/api/scenarios") {
            if ($request.HttpMethod -eq "GET") {
                $resJson = $db.scenarios
                $resJsonStr = $resJson | ConvertTo-Json -Depth 100
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJsonStr)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $db.scenarios = ConvertFrom-Json $body
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/slides") {
            if ($request.HttpMethod -eq "GET") {
                $resJson = $db.slides
                $resJsonStr = $resJson | ConvertTo-Json -Depth 100
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJsonStr)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $db.slides = ConvertFrom-Json $body
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/assignments") {
            if ($request.HttpMethod -eq "GET") {
                [array]$assignments = @()
                if ($db.assignments) { $assignments = @($db.assignments) }
                $resJson = $assignments | ConvertTo-Json -Depth 100; if ($null -eq $resJson) { $resJson = "[]" }
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $db.assignments = ConvertFrom-Json $body
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/results") {
            if ($request.HttpMethod -eq "GET") {
                [array]$results = @()
                if ($db.results) { $results = @($db.results) }
                $resJson = $results | ConvertTo-Json -Depth 100; if ($null -eq $resJson) { $resJson = "[]" }
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $newResult = ConvertFrom-Json $body
                if (-not $newResult.date) {
                    $newResult | Add-Member -MemberType NoteProperty -Name "date" -Value (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                }
                
                [array]$results = @()
                if ($db.results) { $results = @($db.results) }
                $results += $newResult
                $db.results = $results
                
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/ai-results") {
            if ($request.HttpMethod -eq "GET") {
                [array]$aiResults = @()
                if ($db.aiResults) { $aiResults = @($db.aiResults) }
                $resJson = $aiResults | ConvertTo-Json -Depth 100; if ($null -eq $resJson) { $resJson = "[]" }
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $newResult = ConvertFrom-Json $body
                if (-not $newResult.date) {
                    $newResult | Add-Member -MemberType NoteProperty -Name "date" -Value (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                }
                
                [array]$aiResults = @()
                if ($db.aiResults) { $aiResults = @($db.aiResults) }
                $aiResults += $newResult
                $db.aiResults = $aiResults
                
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/smtp") {
            if ($request.HttpMethod -eq "GET") {
                $smtpSettings = $null
                if ($db.smtp) { $smtpSettings = $db.smtp }
                else {
                    $smtpSettings = @{
                        server = ""
                        port = 587
                        enableSsl = $true
                        username = ""
                        password = ""
                    }
                }
                $resJson = $smtpSettings | ConvertTo-Json -Depth 100
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
                
                $db.smtp = ConvertFrom-Json $body
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                
                $okJson = @{ success = $true } | ConvertTo-Json
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
        }
        elseif ($rawPath -eq "/api/users/update-email" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()
            
            $updateInfo = ConvertFrom-Json $body
            $userId = $updateInfo.id
            $email = $updateInfo.email
            
            $updated = $false
            foreach ($u in $db.users) {
                if ($u.id -eq $userId) {
                    if (-not ($u | Get-Member -Name "email")) {
                        $u | Add-Member -MemberType NoteProperty -Name "email" -Value $email -Force
                    } else {
                        $u.email = $email
                    }
                    $updated = $true
                    break
                }
            }
            
            if ($updated) {
                $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
                $okJson = @{ success = $true } | ConvertTo-Json
                $response.StatusCode = 200
            } else {
                $okJson = @{ error = "User not found" } | ConvertTo-Json
                $response.StatusCode = 404
            }
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes($okJson)
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
        }
        elseif ($rawPath -eq "/api/send-invite" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()
            
            $inviteInfo = ConvertFrom-Json $body
            $userId = $inviteInfo.userId
            $email = $inviteInfo.email
            
            $user = $db.users | Where-Object { $_.id -eq $userId }
            $employeeName = if ($user) { $user.name } else { "Employee" }
            
            foreach ($u in $db.users) {
                if ($u.id -eq $userId) {
                    if (-not ($u | Get-Member -Name "email")) {
                        $u | Add-Member -MemberType NoteProperty -Name "email" -Value $email -Force
                    } else {
                        $u.email = $email
                    }
                    break
                }
            }
            $db | ConvertTo-Json -Depth 100 | Out-File $dbPath -Encoding utf8
            
            $hostHeader = $request.UserHostName
            if (-not $hostHeader) { $hostHeader = "localhost:8888" }
            $loginLink = "http://$hostHeader/?login=$userId"
            
            $subject = "Invitation to Zain Cash Customer Care Test"
            $emailBody = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; direction: ltr; }
        .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid #ff9900; }
        .body { padding: 30px; line-height: 1.6; color: #334155; text-align: left; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #ff9900 0%, #ff6600 100%); color: #ffffff !important; padding: 12px 35px; font-weight: bold; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 10px rgba(255, 153, 0, 0.3); font-size: 16px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2 style="margin: 0; font-size: 22px;">Zain Cash Customer Care Academy</h2>
        </div>
        <div class="body">
            <h3 style="margin-top: 0; color: #0f172a;">Hello $employeeName,</h3>
            <p>You have been invited to perform a practice evaluation on the **Zain Cash Customer Care Chat Simulator**.</p>
            <p>Please click the button below to start your training and testing session directly. Your performance and results will be automatically saved and reported to the management.</p>
            <div class="btn-container">
                <a href="$loginLink" class="btn">Start Test Now</a>
            </div>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">* Note: This link is unique to you for quick login to start the test without requiring credentials.</p>
        </div>
        <div class="footer">
            All rights reserved © Zain Cash Customer Care Academy 2026
        </div>
    </div>
</body>
</html>
"@

            $sent = $false
            $simulated = $false
            $errorMsg = ""
            
            if ($db.smtp -and $db.smtp.server -and $db.smtp.username) {
                try {
                    $smtpServer = $db.smtp.server
                    $smtpPort = $db.smtp.port
                    $smtpUser = $db.smtp.username
                    $smtpPassword = $db.smtp.password
                    $useSsl = $db.smtp.enableSsl
                    
                    $secPassword = ConvertTo-SecureString $smtpPassword -AsPlainText -Force
                    $creds = New-Object System.Management.Automation.PSCredential($smtpUser, $secPassword)
                    
                    $fromFriendly = "Zain Cash Academy <$smtpUser>"
                    Send-MailMessage -From $fromFriendly -To $email -Subject $subject -Body $emailBody -BodyAsHtml -SmtpServer $smtpServer -Port $smtpPort -Credential $creds -UseSsl -Encoding UTF8
                    $sent = $true
                } catch {
                    $errorMsg = $_.Exception.Message
                    Write-Host "SMTP Error: $errorMsg" -ForegroundColor Red
                }
            } else {
                $simulated = $true
            }
            
            $resJson = @{
                success = ($sent -or $simulated)
                sent = $sent
                simulated = $simulated
                link = $loginLink
                error = $errorMsg
            } | ConvertTo-Json
            
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
            $response.StatusCode = 200
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
        }
        else {
            $response.StatusCode = 404
        }
        
        $response.OutputStream.Close()
        continue
    }

    if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }
    $filePath = Join-Path $folder ($rawPath.TrimStart("/").Replace("/", "\"))

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
        Write-Host "[OK]  $rawPath" -ForegroundColor DarkGray
    } else {
        $response.StatusCode = 404
        Write-Host "[404] $rawPath" -ForegroundColor Red
    }

    $response.OutputStream.Close()
}
