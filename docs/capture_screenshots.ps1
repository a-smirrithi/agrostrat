$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempDir = "C:\Users\User\Desktop\agrostrat_screens"
$finalDir = "C:\Users\User\Desktop\fsd proj\docs\screenshots"

if (!(Test-Path $tempDir)) { New-Item -ItemType Directory -Force -Path $tempDir }
if (!(Test-Path $finalDir)) { New-Item -ItemType Directory -Force -Path $finalDir }

Write-Host "Capturing Fig 7.1: Farmland Classification (Kanchipuram Paddy Farm)..."
Start-Process $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,960", "--virtual-time-budget=4000", "--screenshot=$tempDir\fig7_1_field_verification.png", "http://localhost:5173/?tab=checker&preset=chennai-paddy-kanchipuram" -Wait

Start-Sleep -Seconds 1

Write-Host "Capturing Fig 7.2: Residential House Classification (T. Nagar House)..."
Start-Process $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,960", "--virtual-time-budget=4000", "--screenshot=$tempDir\fig7_2_residential_verification.png", "http://localhost:5173/?tab=checker&preset=chennai-house-tnagar" -Wait

Start-Sleep -Seconds 1

Write-Host "Capturing Fig 7.3: Today's Field Action Plan (Notes & Measured Telemetry)..."
Start-Process $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,960", "--virtual-time-budget=4000", "--screenshot=$tempDir\fig7_3_field_action_plan.png", "http://localhost:5173/?tab=advisory&preset=chennai-paddy-kanchipuram" -Wait

Start-Sleep -Seconds 1

Write-Host "Capturing Fig 7.4: 7-Day Weather Forecast & Operations Calendar..."
Start-Process $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,960", "--virtual-time-budget=4000", "--screenshot=$tempDir\fig7_4_weather_outlook.png", "http://localhost:5173/?tab=weather" -Wait

Start-Sleep -Seconds 1

Write-Host "Capturing Fig 7.5: Custom Coordinates & GPS Land Analyzer..."
Start-Process $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,960", "--virtual-time-budget=4000", "--screenshot=$tempDir\fig7_5_custom_coordinates.png", "http://localhost:5173/?tab=checker&custom=true" -Wait

Copy-Item "$tempDir\*.png" -Destination $finalDir -Force
Write-Host "All 5 screenshots captured and copied successfully to $finalDir."
Get-ChildItem $finalDir | Select-Object Name, Length
