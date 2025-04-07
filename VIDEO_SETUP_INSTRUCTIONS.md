# Setting Up Videos for Your Stretching App

To make the video playback work correctly in your app, follow these steps:

## 1. Create Sample Video Files

Since you may not have actual stretch videos yet, you can create simple placeholder videos for testing:

1. Create a short video (5-10 seconds) for each stretch
2. You can use your phone's camera to record simple movements
3. Or use free stock videos from sites like Pexels or Pixabay

## 2. Name Your Video Files Correctly

The app expects specific filenames for each stretch. Name your video files exactly as follows:

- forward-backward-bend.mp4
- lean-back.mp4
- arm-circle.mp4
- arm-extension.mp4
- arm-raise.mp4
- tricep-stretch.mp4
- calf-stretch.mp4
- quad-stretch.mp4
- lunge.mp4
- cat-pose.mp4
- childs-pose.mp4
- sphinx.mp4
- side-twist.mp4
- wall-squat.mp4
- dab-stretch.mp4

## 3. Place Files in the Assets Directory

Put all video files in the `assets/videos/` directory of your project.

## 4. Required Packages

Make sure you've installed the Expo AV package:

```
npx expo install expo-av
```

## 5. Building the App

When you build your app, the videos will be bundled with it. This approach works well for videos that:
- Are relatively small in size (ideally under 10MB each)
- Won't need frequent updates

## Troubleshooting

If you encounter a white/black screen or errors when playing videos:

1. **Check file formats**: Make sure all videos are in MP4 format
2. **Check filenames**: Ensure exact spelling matches (including hyphens)
3. **Add error handling**: The app now includes error handling to show a message if a video can't be loaded
4. **Check file sizes**: Very large video files may cause performance issues
5. **Clear cache**: Sometimes clearing your development server cache helps (`npx expo start -c`)

## Alternative Approaches

If your videos are large or will be updated frequently, consider:

1. **Streaming from a server**: Host videos online and stream them
2. **Downloading on demand**: Have the app download videos when needed
3. **Using a CDN**: For production apps with many users

These approaches would require additional code changes.
