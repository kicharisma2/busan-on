@echo off
chcp 65001 >nul
title 부산ON 월드 v2.3 - 글로벌 인터넷 멀티플레이 서버
cd /d "%~dp0"

echo ========================================================
echo  [부산ON 월드 v2.3] 글로벌 인터넷 멀티플레이 서버를 시작합니다...
echo ========================================================
echo.

python --version >nul 2>&1
if %errorlevel% equ 0 (
    python start_online_server.py
) else (
    if exist "부산ON_글로벌서버_v2.exe" (
        echo [안내] Python 대신 독립 실행형 서버(부산ON_글로벌서버_v2.exe)를 실행합니다.
        "부산ON_글로벌서버_v2.exe"
    ) else if exist "dist\부산ON_글로벌서버_v2.exe" (
        echo [안내] dist 폴더 내 독립 실행형 서버를 실행합니다.
        "dist\부산ON_글로벌서버_v2.exe"
    ) else if exist "부산ON_글로벌서버.exe" (
        "부산ON_글로벌서버.exe"
    ) else (
        echo [오류] 실행할 Python 또는 부산ON_글로벌서버_v2.exe를 찾을 수 없습니다.
        pause
    )
)
pause
