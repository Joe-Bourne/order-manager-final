@ECHO OFF
SETLOCAL

:: Get the folder where this script is located
SET SCRIPT_DIR=%~dp0
CD /D %SCRIPT_DIR%

Echo Docker Build...
docker build -t order-manager-app .

Echo Docker Compose...
docker-compose up

ENDLOCAL


pause
