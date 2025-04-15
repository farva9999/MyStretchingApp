@echo off
echo Building debug APK for MyStretchingApp
echo This will create a debug version with better error reporting

echo Checking for proper environment setup...
where expo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Expo CLI not found. Please install it first:
  echo npm install -g expo-cli
  exit /b 1
)

echo Cleaning project...
rd /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies...
call npm install

echo Building debug APK...
call eas build -p android --profile preview

echo.
echo When the build is complete, install it on your device with:
echo adb install path-to-your-downloaded-apk.apk
echo.
echo After installing, run this command to see error logs:
echo adb logcat ^| findstr "ReactNativeJS"
echo.
echo See DEBUG_INSTRUCTIONS.md for more troubleshooting tips.
