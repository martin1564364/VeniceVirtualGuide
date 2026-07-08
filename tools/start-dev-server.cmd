@echo off
cd /d "%~dp0.."
"C:\Program Files\nodejs\node.exe" "%~dp0dev-server.mjs" > "%~dp0..\dev-server.out.log" 2> "%~dp0..\dev-server.err.log"
