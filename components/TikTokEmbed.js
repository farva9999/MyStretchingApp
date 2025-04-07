import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const aspectRatio = 16 / 9;
const videoWidth = width - 32; // 16px padding on each side
const videoHeight = videoWidth / aspectRatio;

const TikTokEmbed = ({ videoId, creator, title, onLoad, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Create a direct URL to the TikTok video
  const videoUrl = `https://www.tiktok.com/${creator}/video/${videoId}?lang=en&embed=true`;

  const handleLoadEnd = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleLoadError = (error) => {
    console.error('TikTok load error:', error);
    setLoading(false);
    setError(true);
    if (onError) onError(error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.creator}>{creator}</Text>
      
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
              Could not load the TikTok video. Please check your internet connection or try again later.
            </Text>
          </View>
        ) : (
          <WebView
            style={[styles.webview, { height: videoHeight }]}
            source={{ uri: videoUrl }}
            onLoadEnd={handleLoadEnd}
            onError={handleLoadError}
            onHttpError={handleLoadError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
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
  creator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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

export default TikTokEmbed;
