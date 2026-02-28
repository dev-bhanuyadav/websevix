@echo off
cd /d "c:\Users\Administrator\Downloads\My Projects\Websevix"
echo Initializing Git...
git init
git add .
git commit -m "Initial commit: Websevix landing page"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
echo.
echo Ab push hoga. Jab username/password puche:
echo Username: dev-bhanuyadav
echo Password: Apna GitHub PAT (token) paste karein
echo.
git push -u origin main
pause
