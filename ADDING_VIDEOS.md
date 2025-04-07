# Adding Videos to Your Flexibility App

This guide will help you add new TikTok and YouTube videos to your app without needing to modify code.

## Where to Add Videos

All videos are stored in a single data file:
```
E:\Programming\MyStretchingApp\data\yoga\videos.js
```

## Video Object Structure

Each video needs the following information:

### For TikTok Videos:
```javascript
{
  id: "unique-id", // Any unique string identifier
  platform: "tiktok",
  videoId: "1234567890", // The TikTok video ID
  creator: "username", // TikTok username WITHOUT @ symbol
  title: "Video Title", // Display title in the app
  description: "Short description", // Optional description
  tags: ["tag1", "tag2"] // Optional tags for categorization
}
```

### For YouTube Videos:
```javascript
{
  id: "unique-id", // Any unique string identifier
  platform: "youtube",
  videoId: "abcdefghijk", // The YouTube video ID
  creator: "Channel Name", // Creator or channel name
  title: "Video Title", // Display title in the app
  description: "Short description", // Optional description
  duration: "10:30", // Video duration (optional)
  tags: ["tag1", "tag2"] // Optional tags for categorization
}
```

## How to Extract Video IDs

### TikTok Video ID:
1. Find the TikTok video URL, which looks like:
   `https://www.tiktok.com/@username/video/7423572121588157739`
2. The last number after `/video/` is the video ID (7423572121588157739)
3. The username is "username" (without the @ symbol)

### YouTube Video ID:
1. Find the YouTube video URL, which looks like:
   `https://www.youtube.com/watch?v=oX6I6vs1EFs`
2. The part after `v=` is the video ID (oX6I6vs1EFs)
3. For a YouTube Shorts URL (`https://www.youtube.com/shorts/abcdefg`), use the part after `/shorts/`

## Example: Adding a New TikTok Video

1. Open `videos.js`
2. Find the `shorts` array
3. Add a new object with your video info:
```javascript
shorts: [
  // ... existing videos
  {
    id: "tiktok2",
    platform: "tiktok",
    videoId: "1234567890",
    creator: "newcreator",
    title: "New Yoga Routine",
    description: "A beginner-friendly yoga sequence",
    tags: ["yoga", "beginner"]
  },
]
```

## Example: Adding a New YouTube Video

1. Open `videos.js`
2. Find the `full` array
3. Add a new object with your video info:
```javascript
full: [
  // ... existing videos
  {
    id: "youtube2",
    platform: "youtube",
    videoId: "abcdefghijk",
    creator: "Yoga Channel",
    title: "45-Minute Full Body Yoga",
    description: "A comprehensive yoga session for intermediate practitioners",
    duration: "45:30",
    tags: ["yoga", "intermediate", "full body"]
  },
]
```

## Important Notes

- Make sure to give each video a unique ID
- The app will automatically reload with your new videos when you restart it
- Keep descriptions short to fit well in the UI
- For TikTok videos, the app will show a preview card that links to TikTok when tapped
- YouTube videos will play directly in the app
- Be mindful of copyright and only embed videos that allow embedding
