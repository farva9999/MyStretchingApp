import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { recordCompletedActivity } from '../utils/storageUtils';

// Create a video mapping for easier require statements
const videoMapping = {
  'forward-backward-bend.mp4': require('../assets/videos/forward-backward-bend.mp4'),
  'lean-back.mp4': require('../assets/videos/lean-back.mp4'),
  'arm-circle.mp4': require('../assets/videos/arm-circle.mp4'),
  'arm-extension.mp4': require('../assets/videos/arm-extension.mp4'),
  'arm-raise.mp4': require('../assets/videos/arm-raise.mp4'),
  'tricep-stretch.mp4': require('../assets/videos/tricep-stretch.mp4'),
  'calf-stretch.mp4': require('../assets/videos/calf-stretch.mp4'),
  'quad-stretch.mp4': require('../assets/videos/quad-stretch.mp4'),
  'lunge.mp4': require('../assets/videos/lunge.mp4'),
  'cat-pose.mp4': require('../assets/videos/cat-pose.mp4'),
  'childs-pose.mp4': require('../assets/videos/childs-pose.mp4'),
  'sphinx.mp4': require('../assets/videos/sphinx.mp4'),
  'side-twist.mp4': require('../assets/videos/side-twist.mp4'),
  'wall-squat.mp4': require('../assets/videos/wall-squat.mp4'),
  'dab-stretch.mp4': require('../assets/videos/dab-stretch.mp4'),
};

const StretchDetail = ({ route, navigation }) => {
  const { stretch } = route.params;
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(stretch.duration);
  const [timerActive, setTimerActive] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [stretchCompleted, setStretchCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining => timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !stretchCompleted) {
      setTimerActive(false);
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
      // Record completion when timer reaches zero
      recordActivityCompletion();
      setStretchCompleted(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, stretchCompleted]);

  const recordActivityCompletion = async () => {
    try {
      const stats = await recordCompletedActivity('STRETCH');
      
      // Show a congratulatory message with updated stats
      Alert.alert(
        'Stretch Completed!',
        `Great job! You've completed ${stats.count} stretches total.\n\nCurrent streak: ${stats.streak} days`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      console.log('Error recording stretch completion:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (videoRef.current) {
        if (status.isPlaying) {
          await videoRef.current.pauseAsync();
          setTimerActive(false);
        } else {
          await videoRef.current.playAsync();
          setTimerActive(true);
        }
      }
    } catch (error) {
      console.log('Error controlling video:', error);
    }
  };

  const resetTimer = async () => {
    setTimeRemaining(stretch.duration);
    setTimerActive(false);
    setStretchCompleted(false);
    try {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(0);
      }
    } catch (error) {
      console.log('Error resetting video:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderVideo = () => {
    try {
      const videoSource = videoMapping[stretch.videoFile];
      
      return (
        <Video
          ref={videoRef}
          source={videoSource}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={true}
          style={styles.video}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          onError={(error) => {
            console.log('Video error:', error);
            setVideoError(true);
          }}
        />
      );
    } catch (error) {
      console.log('Video loading error:', error);
      setVideoError(true);
      return (
        <View style={[styles.video, styles.videoError]}>
          <Text style={styles.videoErrorText}>
            Video not available. Please ensure you have the correct video files in your assets folder.
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{stretch.title}</Text>
        <View style={styles.videoContainer}>
          {renderVideo()}
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton} disabled={videoError}>
              <MaterialIcons 
                name={status.isPlaying ? "pause" : "play-arrow"} 
                size={36} 
                color={videoError ? "#ccc" : "#007AFF"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={resetTimer} style={styles.controlButton} disabled={videoError}>
              <MaterialIcons name="refresh" size={36} color={videoError ? "#ccc" : "#007AFF"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{stretch.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {stretch.benefits.map((benefit, index) => (
            <Text key={index} style={styles.listItem}>• {benefit}</Text>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {stretch.instructions.map((instruction, index) => (
            <Text key={index} style={styles.listItem}>{index + 1}. {instruction}</Text>
          ))}
        </View>

        {stretch.tips && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Tips</Text>
            <Text style={styles.description}>{stretch.tips}</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>{stretch.difficulty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{stretch.duration} sec</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Body Part</Text>
              <Text style={styles.metaValue}>{stretch.bodyPart}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  video: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  videoError: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  videoErrorText: {
    padding: 20,
    color: '#666',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 20,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default StretchDetail;
