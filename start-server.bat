@echo off
setlocal

set "BASE_PATH=%~dp0public"
set "ROUTER_PATH=%BASE_PATH%\router.php"

echo ==============================================
echo   Total Darkness - PHP Server Launcher
echo ==============================================
echo.

if not exist "%BASE_PATH%" (
  echo [ERROR] Directorio no encontrado: %BASE_PATH%
  exit /b 1
)

if not exist "%ROUTER_PATH%" (
  echo [ERROR] Router no encontrado: %ROUTER_PATH%
  exit /b 1
)

echo Deteniendo procesos PHP anteriores...
taskkill /F /IM php.exe >nul 2>nul

echo.
echo Iniciando servidor en http://localhost:8000
echo Presiona Ctrl+C para detenerlo.
echo.

pushd "%BASE_PATH%"
php -S localhost:8000 router.php
set "EXIT_CODE=%ERRORLEVEL%"
popd

exit /b %EXIT_CODE%