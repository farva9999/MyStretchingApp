import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const aspectRatio = 16 / 9;
const videoWidth = width - 32; // 16px padding on each side
const videoHeight = videoWidth / aspectRatio;

const YouTubeEmbed = ({ videoId, creator, title, duration, onLoad, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Create HTML content for embedding YouTube video
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe 
        src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0" 
        frameborder="0" 
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <script>
        // Let React Native know when the video is loaded
        window.addEventListener('load', function() {
          window.ReactNativeWebView.postMessage('loaded');
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'loaded') {
      setLoading(false);
      if (onLoad) onLoad();
    }
  };

  const handleLoadError = (error) => {
    console.error('YouTube embed load error:', error);
    setLoading(false);
    setError(true);
    if (onError) onError(error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.creator}>{creator}</Text>
        {duration && <Text style={styles.duration}>{duration}</Text>}
      </View>
      
      <View style={styles.videoContainer}>
        {loading && (
          <View style={[styles.loadingContainer, { height: videoHeight }]}>
            <ActivityIndicator size="large" color="#007aff" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        
        {error ? (
          <View style={[styles.errorContainer, { height: videoHeight }]}>
            <Text style={styles.errorText}>
              Could not load the video. Please check your internet connection.
            </Text>
          </View>
        ) : (
          <WebView
            style={[styles.webview, { height: videoHeight }]}
            source={{ html: htmlContent }}
            originWhitelist={['*']}
            onMessage={handleMessage}
            onError={handleLoadError}
            onHttpError={handleLoadError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
            renderLoading={() => null} // We handle loading UI ourselves
            scalesPageToFit={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  creator: {
    fontSize: 14,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: videoWidth,
  },
  webview: {
    width: videoWidth,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width: videoWidth,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width: videoWidth,
    padding: 16,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
  },
});

export default YouTubeEmbed;
