import { Linking } from 'react-native';import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // 16px padding on each side
const imageHeight = cardWidth * 0.56; // 16:9 aspect ratio

const TikTokPreview = ({ videoId, creator, title, description, thumbnail }) => {
  // Default placeholder image in case no thumbnail is provided
  // Note: Using a colored view instead of an image for simplicity
  
  // TikTok URL to open
  const tiktokUrl = `https://www.tiktok.com/@${creator}/video/${videoId}`;
  
  // Handle opening TikTok
  const handleOpenTikTok = async () => {
    try {
      await Linking.openURL(tiktokUrl);
    } catch (error) {
      Alert.alert(
        "Cannot Open TikTok",
        "Could not open the TikTok app or website. Please check if TikTok is installed or try again later.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenTikTok}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <View style={styles.thumbnailPlaceholder} />
          <View style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={32} color="#fff" />
          </View>
          <View style={styles.tiktokBadge}>
            <Text style={styles.tiktokText}>TikTok</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.creator}>@{creator}</Text>
          {description && <Text style={styles.description} numberOfLines={2}>{description}</Text>}
          
          <View style={styles.footer}>
            <Text style={styles.tapToView}>Tap to view on TikTok</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
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
    width: cardWidth,
    height: imageHeight,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ee1d52', // TikTok red color
    opacity: 0.8,
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
  tiktokBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  tiktokText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentContainer: {
    padding: 16,
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
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tapToView: {
    fontSize: 12,
    color: '#007aff',
  },
});

export default TikTokPreview;
