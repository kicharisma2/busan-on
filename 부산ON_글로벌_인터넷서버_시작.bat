@echo off
chcp 65001 >nul
title 부산ON 월드 - 글로벌 인터넷 멀티플레이 서버
cd /d "%~dp0"

echo ========================================================
echo  [부산ON 월드] 글로벌 인터넷 멀티플레이 서버를 시작합니다...
echo ========================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python이 설치되어 있지 않거나 환경변수 PATH에 등록되지 않았습니다.
    pause
    exit /b
)

python start_online_server.py
pause

