Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting MediaFlow SaaS Platform Core" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Launching FastAPI Backend on http://127.0.0.1:8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn app.main:app --port 8080 --reload"

Write-Host "[2/2] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Platform Services Initialized!" -ForegroundColor Yellow
Write-Host "  - Web Application:  http://localhost:3000" -ForegroundColor White
Write-Host "  - YouTube SEO Page: http://localhost:3000/youtube" -ForegroundColor White
Write-Host "  - Pinterest Page:   http://localhost:3000/pinterest" -ForegroundColor White
Write-Host "  - Backend API Docs: http://127.0.0.1:8080/api/v1/docs" -ForegroundColor White
Write-Host "  - Health Endpoint:  http://127.0.0.1:8080/health" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
