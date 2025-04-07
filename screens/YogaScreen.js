import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  RefreshControl,
  Alert
} from 'react-native';
import HorizontalTikTokPlayer from '../components/HorizontalTikTokPlayer';
import TikTokPlayer from '../components/TikTokPlayer';
import YouTubeEmbed from '../components/YouTubeEmbed';
import CategorySection from '../components/CategorySection';
import { yogaVideos } from '../data/yoga/videos';
import { MaterialIcons } from '@expo/vector-icons';

// Check if NetInfo is available
let NetInfoModule;
try {
  NetInfoModule = require('@react-native-community/netinfo');
} catch (e) {
  console.warn('NetInfo module not available, offline detection disabled');
}

const YogaScreen = () => {
  const [activeTab, setActiveTab] = useState('shorts');
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [categories, setCategories] = useState([]);

  // Organize videos by category
  useEffect(() => {
    const categoryMap = {};
    yogaVideos.shorts.forEach(video => {
      const category = video.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(video);
    });
    
    // Convert to array for rendering
    const categoryArray = Object.keys(categoryMap).map(category => ({
      title: category,
      videos: categoryMap[category]
    }));
    
    setCategories(categoryArray);
  }, []);

  // Check network connectivity
  const checkConnectivity = async () => {
    if (NetInfoModule) {
      const state = await NetInfoModule.fetch();
      setIsOffline(!state.isConnected);
      
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Videos require an internet connection to play. Please check your connection and try again.",
          [{ text: "OK" }]
        );
      }
      
      return state.isConnected;
    }
    return true; // Assume online if NetInfo not available
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await checkConnectivity();
    setRefreshing(false);
  };

  // Component for when there are no videos
  const NoVideosMessage = () => (
    <View style={styles.noVideosContainer}>
      <MaterialIcons name="videocam-off" size={48} color="#ccc" />
      <Text style={styles.noVideosText}>No videos available yet</Text>
      <Text style={styles.noVideosSubtext}>Check back soon for new content</Text>
    </View>
  );

  // Component for offline message
  const OfflineMessage = () => (
    <View style={styles.offlineContainer}>
      <MaterialIcons name="wifi-off" size={48} color="#ff3b30" />
      <Text style={styles.offlineText}>You're offline</Text>
      <Text style={styles.offlineSubtext}>
        Videos require an internet connection to play
      </Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={checkConnectivity}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render TikTok shorts by category
  const renderCategorizedShorts = () => {
    if (isOffline) {
      return <OfflineMessage />;
    }

    if (categories.length === 0) {
      return <NoVideosMessage />;
    }

    return categories.map((category, index) => (
      <CategorySection
        key={`category-${index}`}
        title={category.title}
        videos={category.videos}
        renderItem={({ item }) => (
          <HorizontalTikTokPlayer
            videoId={item.videoId}
            creator={item.creator}
            title={item.title}
            description={item.description}
          />
        )}
      />
    ));
  };

  // Render traditional display (all videos in a grid)
  const renderTraditionalShorts = () => {
    if (isOffline) {
      return <OfflineMessage />;
    }

    if (yogaVideos.shorts.length === 0) {
      return <NoVideosMessage />;
    }

    return yogaVideos.shorts.map(video => (
      <TikTokPlayer
        key={video.id}
        videoId={video.videoId}
        creator={video.creator}
        title={video.title}
        description={video.description}
      />
    ));
  };

  // Render YouTube videos
  const renderFullVideos = () => {
    if (isOffline) {
      return <OfflineMessage />;
    }

    if (yogaVideos.full.length === 0) {
      return <NoVideosMessage />;
    }

    return yogaVideos.full.map(video => (
      <YouTubeEmbed
        key={video.id}
        videoId={video.videoId}
        creator={video.creator}
        title={video.title}
        duration={video.duration}
        onError={() => checkConnectivity()}
      />
    ));
  };

  // Initial connectivity check
  useEffect(() => {
    checkConnectivity();
    
    // Set up listener for connectivity changes if NetInfo is available
    let unsubscribe;
    if (NetInfoModule) {
      unsubscribe = NetInfoModule.addEventListener(state => {
        setIsOffline(!state.isConnected);
      });
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shorts' && styles.activeTab]}
          onPress={() => setActiveTab('shorts')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'shorts' && styles.activeTabText
            ]}
          >
            SHORTS
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'full' && styles.activeTab]}
          onPress={() => setActiveTab('full')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'full' && styles.activeTabText
            ]}
          >
            FULL SESSIONS
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007aff']}
          />
        }
      >
        {activeTab === 'shorts' ? renderCategorizedShorts() : renderFullVideos()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007aff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#007aff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  noVideosContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideosText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  noVideosSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  offlineContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 16,
  },
  offlineText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  offlineSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#007aff',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default YogaScreen;
