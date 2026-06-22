@echo off
cd /d "%~dp0"
title 넘버 트레일 : 수의 모험
echo.
echo  넘버 트레일 : 수의 모험
echo  ===========================
echo.

where node >nul 2>&1 || (
  echo [오류] Node.js 가 설치되어 있지 않습니다.
  echo        https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행하세요.
  pause
  exit /b 1
)

if not exist node_modules (
  echo npm install 실행 중...
  call npm install
  if errorlevel 1 (
    echo [오류] npm install 실패
    pause
    exit /b 1
  )
)

where python >nul 2>&1 && python scripts\remove_checkerboard.py

echo.
echo  개발 서버 시작 중... 준비되면 브라우저가 자동으로 열립니다.
echo  주소: http://localhost:5173/
echo  종료: 이 창에서 Ctrl+C
echo.

npm run dev
if errorlevel 1 (
  echo.
  echo [오류] 서버 시작 실패. 위 메시지를 확인하세요.
  pause
)
