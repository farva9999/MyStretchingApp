@echo off
echo Building production APK for MyStretchingApp
echo This will create a complete bundled APK that doesn't need Metro

:: Check for npm and expo installation
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: npm not found. Please install Node.js and npm first.
  exit /b 1
)

where eas >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: EAS CLI not found. Installing it now...
  call npm install -g eas-cli
)

:: Clean and prepare the project
echo Cleaning project...
if exist node_modules (
  rd /s /q node_modules
)
if exist .expo (
  rd /s /q .expo
)
if exist dist (
  rd /s /q dist
)
del package-lock.json 2>nul

echo Installing dependencies...
call npm install

:: Create the production build
echo Building production APK...
call eas build --platform android --profile production --non-interactive --no-wait

echo.
echo The build process has started in the EAS cloud.
echo You'll receive an email when your build is complete with a download link.
echo.
echo IMPORTANT: This production build includes the JavaScript bundle in the APK
echo so it will work without requiring Metro to be running.
echo.
