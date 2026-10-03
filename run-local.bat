@echo off
echo ===================================================
echo   Starting MediaFlow SaaS Platform Core
echo ===================================================
echo.
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8080...
start "MediaFlow Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --port 8080 --reload"

echo [2/2] Launching Next.js Frontend on http://localhost:3000...
start "MediaFlow Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Platform Services Initialized!
echo   - Web Application:  http://localhost:3000
echo   - YouTube SEO Page: http://localhost:3000/youtube
echo   - Pinterest Page:   http://localhost:3000/pinterest
echo   - Backend API Docs: http://127.0.0.1:8080/api/v1/docs
echo   - Health Endpoint:  http://127.0.0.1:8080/health
echo ===================================================
pause
