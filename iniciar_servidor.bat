@echo off
title EBRO S700 - WebUSB Sideload Hub
echo =======================================================
echo   🚗 EBRO S700 ^& Desay SV ^| WebUSB Sideload Hub
echo =======================================================
echo.
echo Iniciando servidor local y abriendo navegador...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo El servidor se ha detenido con error.
    pause
)
