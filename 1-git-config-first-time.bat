@echo off
echo ============================================
echo   Git Name + Email Setup (Sirf ek baar)
echo ============================================
echo.

set /p GITNAME="Apna naam (e.g. Bhanu Yadav): "
set /p GITEMAIL="Apna email (e.g. dev-bhanuyadav@gmail.com): "

git config --global user.name "%GITNAME%"
git config --global user.email "%GITEMAIL%"

echo.
echo Done. Ab check karo:
git config --global user.name
git config --global user.email
echo.
echo Ab 2-push-to-github.bat chala sakte ho.
pause
