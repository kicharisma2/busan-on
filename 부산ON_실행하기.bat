@echo off
chcp 65001 >nul
title 부산ON 월드 v2.0 - 부산광역시청 시민소통 메타버스
cd /d "%~dp0"
echo ========================================================
echo  [부산ON 월드 v2.0] 부산광역시청 & 16개 구·군청 메타버스를 시작합니다...
echo ========================================================
echo.
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python 환경이 감지되었습니다. 로컬 서버(포트 8080)를 실행하고 브라우저를 엽니다.
    start "" "http://localhost:8080/index.html"
    python server.py
) else (
    echo 브라우저로 바로 실행합니다...
    start "" "index.html"
)
pause
