# Debugging Your MyStretchingApp

This guide provides instructions on how to debug the app when it crashes on your physical device.

## ADB Debugging

1. Connect your Android device to your computer with USB debugging enabled.
2. Open a command prompt or terminal window.
3. Run the following command to view real-time logs from your device:

```
adb logcat | findstr "ReactNativeJS"
```

For macOS/Linux:
```
adb logcat | grep "ReactNativeJS"
```

This will show React Native JavaScript errors when they occur.

## Common Error Checking

If the app is crashing immediately, check for these common issues:

### 1. Check if videos are properly bundled

Connect to your device and verify the APK content:

```
adb shell
cd /data/data/com.yourname.mystretchingapp/files
ls -la
```

### 2. Check AsyncStorage permissions

```
adb shell
ls -la /data/data/com.yourname.mystretchingapp/files/AsyncStorage
```

### 3. Check WebView installation

Make sure WebView is properly installed on your device:
- Go to Settings > Apps > Android System WebView
- Make sure it's enabled and up to date

## Building a Debug APK

If you need a debug version of the app with more detailed error information:

1. Update your eas.json file (already done in the fixes).
2. Build a debug APK:

```
expo login
eas build -p android --profile preview
```

3. Install the debug APK:

```
adb install /path/to/your/mystretchingapp.apk
```

## Simplified Testing Version

If you still experience crashes, try creating a simplified version:

1. Comment out the TikTok components in your screens
2. Remove WebView usage temporarily
3. Test if videos play without WebView components

## Device Compatibility Check

Verify your device meets these requirements:
- Android 6.0 or later
- Google Play Services installed
- Sufficient storage space (at least 100MB free)
- No aggressive battery optimization settings that might kill background processes

## If All Else Fails

Try these steps:
1. Clear app data and cache on your device
2. Reinstall the app
3. Make sure all required permissions are granted in your device settings
4. Try running on a different device to isolate hardware-specific issues

## Getting Help

If you're still experiencing crashes after trying these solutions:
1. Collect your complete error logs using adb logcat
2. Take screenshots of any error messages
3. Document the exact steps that lead to the crash
4. Check for known issues in the Expo and React Native GitHub repositories
5. Post your issue on Stack Overflow with the "react-native" and "expo" tags

## Preventing Future Crashes

1. Implement error boundary components around critical features
2. Use try/catch blocks for all async operations
3. Add offline fallbacks for network-dependent features
4. Test thoroughly on low-end devices before deploying
5. Monitor app performance using Expo's performance tools
