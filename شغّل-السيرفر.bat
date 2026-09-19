@echo off
title "Zain Cash Presentation and Training Server"
cd /d "%~dp0"
echo ========================================================
echo Starting Zain Cash Enterprise Academy Server...
echo ========================================================
start http://localhost:8888
node server.js
pause
