@echo off
title Zain Cash Presentation Server
powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File ""%~dp0start-server.ps1""' -Verb RunAs"
