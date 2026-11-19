@echo off
chcp 65001 > nul
title 부산ON - 블렌더 3D AI 연동 실행기
echo =======================================================
echo    🎨 부산ON x Blender 5.3 3D AI 스튜디오 실행기
echo =======================================================
echo [1/3] Tripo 3D AI 환경 변수 설정 중...
set TRIPO_API_KEY=tsk_fa7-iYRGx72kG2Y4GBqYT1CXZ0FW775uvdR64-9JsUy

echo [2/3] 블렌더 5.3 설치 경로 확인 중...
set BLENDER_EXE="C:\Program Files\Blender Foundation\Blender 5.3\blender.exe"

if not exist %BLENDER_EXE% (
    echo [오류] 블렌더 실행 파일을 찾을 수 없습니다: %BLENDER_EXE%
    pause
    exit /b 1
)

echo [3/3] 블렌더를 실행합니다... (Tripo 3D AI 애드온 및 495 크레딧 자동 연동 완료)
echo.
echo * 사용 팁:
echo   - 3D 뷰포트에서 [N] 키를 누르면 우측 사이드바가 열립니다.
echo   - [Tripo Model Generator] 탭에서 프롬프트를 입력해 3D 모델을 즉시 생성할 수 있습니다.
echo   - [Tripo Model Manager] 탭에서 생성된 모델을 원클릭으로 블렌더 씬에 불러옵니다.
echo =======================================================
start "" %BLENDER_EXE%
