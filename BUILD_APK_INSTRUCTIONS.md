# Building an APK for Your Stretching App

This guide will walk you through the process of creating an installable APK for your Android device.

## Prerequisites

1. Make sure you have Node.js and npm installed
2. Install Expo CLI globally if you haven't already:
   ```
   npm install -g expo-cli
   ```
3. Have an Expo account (create one at https://expo.dev/signup if needed)

## Build Process

### 1. Install Required Packages

Make sure you have all required packages installed:

```bash
cd E:\Programming\MyStretchingApp
npm install
```

### 2. Login to Expo

```bash
expo login
```

Enter your Expo username and password when prompted.

### 3. Start the Build Process

There are two ways to build your APK:

#### Option 1: Build using EAS (Expo Application Services) - Recommended

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to EAS:
   ```bash
   eas login
   ```

3. Configure EAS Build:
   ```bash
   eas build:configure
   ```

4. Create an eas.json file in your project root:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       },
       "production": {}
     }
   }
   ```

5. Start the build:
   ```bash
   eas build -p android --profile preview
   ```

6. Follow the prompts. EAS will build the APK in the cloud and provide a download link when complete.

#### Option 2: Build locally with Expo (Classic Build)

1. Start the build:
   ```bash
   expo build:android -t apk
   ```

2. Follow the prompts. The build process will take some time.

3. Once completed, Expo will provide a URL to download your APK.

### 4. Install on Your Android Device

1. Download the APK to your Android device
2. Navigate to the downloaded file
3. Tap on it to install
4. You might need to enable "Install from Unknown Sources" in your device settings

## Troubleshooting

- If you encounter any errors during the build process, check the Expo documentation at https://docs.expo.dev/build/setup/
- Make sure your app.json is properly configured
- If you have issues with assets, ensure they're included in the assetBundlePatterns

## For Future Updates

After making changes to your app, you can build a new APK by repeating the build process. Make sure to increment the version number in app.json before building a new version.
