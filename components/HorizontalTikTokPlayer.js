import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Platform,
  Modal,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.75; // Take up 75% of screen width for horizontal list
const videoHeight = cardWidth * 1.2; // Taller aspect ratio for horizontal cards

const HorizontalTikTokPlayer = ({ videoId, creator, title, description }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [embedHtml, setEmbedHtml] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const webViewRef = useRef(null);

  // Create the TikTok video URL
  const tiktokUrl = `https://www.tiktok.com/@${creator}/video/${videoId}`;

  // Fetch TikTok video data using the oEmbed API
  useEffect(() => {
    const fetchTikTokData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the thumbnail URL and embed HTML
        setThumbnailUrl(data.thumbnail_url);
        setEmbedHtml(data.html);
        setVideoInfo(data);
        
        setError(false);
      } catch (error) {
        console.error('Error fetching TikTok data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTikTokData();
  }, [tiktokUrl]);

  // Custom UserAgent to ensure mobile view
  const userAgent = Platform.select({
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    android: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36'
  });

  // HTML content for the WebView using the official embed code
  const createHtmlContent = () => {
    if (embedHtml) {
      return `
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
              min-height: 100vh;
              overflow: hidden;
            }
            .tiktok-container {
              width: 100%;
              max-width: 605px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="tiktok-container">
            ${embedHtml}
          </div>
          <script>
            // Let React Native know when the page is loaded
            window.addEventListener('load', function() {
              window.ReactNativeWebView.postMessage('PAGE_LOADED');
            });
          </script>
        </body>
        </html>
      `;
    }
    
    // Fallback to direct URL if embed code isn't available
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            margin: 0;
            padding: 0;
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
        <iframe src="${tiktokUrl}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
      </body>
      </html>
    `;
  };

  const handleMessage = (event) => {
    const { data } = event.nativeEvent;
    
    if (data === 'PAGE_LOADED') {
      setLoading(false);
    }
  };

  const handleLoadEnd = () => {
    // Set a timer to hide loader even if custom events don't fire
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const handleError = (e) => {
    console.error('WebView error:', e);
    setLoading(false);
    setError(true);
  };

  const handleOpenPlayer = () => {
    setModalVisible(true);
  };

  const handleClosePlayer = () => {
    setModalVisible(false);
    // Reset the WebView when closing
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  // Render the card with loading state or error message
  const renderCard = () => {
    if (loading) {
      return (
        <View style={styles.card}>
          <View style={[styles.imageContainer, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#ee1d52" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.card}>
          <View style={[styles.imageContainer, styles.errorContainer]}>
            <MaterialIcons name="error-outline" size={36} color="#ee1d52" />
            <Text style={styles.errorText}>Error</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {thumbnailUrl ? (
            <Image 
              source={{ uri: thumbnailUrl }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}
          <View style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={32} color="#fff" />
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.creator}>@{creator}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenPlayer} disabled={loading || error}>
        {renderCard()}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleClosePlayer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClosePlayer}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {videoInfo?.title || title}
            </Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.webViewContainer}>
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ee1d52" />
                <Text style={styles.loadingText}>Loading video...</Text>
              </View>
            )}
            
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#ee1d52" />
                <Text style={styles.errorText}>
                  Failed to load the video. Please check your internet connection or try again later.
                </Text>
              </View>
            ) : (
              <WebView
                ref={webViewRef}
                source={{ html: createHtmlContent() }}
                style={styles.webView}
                userAgent={userAgent}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleMessage}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                onHttpError={handleError}
                startInLoadingState={true}
                renderLoading={() => null} // Custom loading UI
                allowsFullscreenVideo={true}
                scalesPageToFit={true}
                allowsBackForwardNavigationGestures={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: videoHeight,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ee1d52', // TikTok red color
    opacity: 0.8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creator: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  placeholder: {
    width: 24,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 12,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    textAlign: 'center',
    color: '#333',
    marginTop: 12,
  },
});

export default HorizontalTikTokPlayer;
