import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { getActivityStats, clearAllStats } from '../utils/storageUtils';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const StatsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    stretch: { count: 0, streak: 0, uniqueDays: 0, last7Days: [] },
    yoga: { count: 0, streak: 0, uniqueDays: 0, last7Days: [] },
    jump: { count: 0, streak: 0, uniqueDays: 0, last7Days: [] }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const stretchStats = await getActivityStats('STRETCH');
      const yogaStats = await getActivityStats('YOGA');
      const jumpStats = await getActivityStats('JUMP');

      setStats({
        stretch: stretchStats,
        yoga: yogaStats,
        jump: jumpStats
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetStats = async () => {
    Alert.alert(
      "Reset All Stats",
      "Are you sure you want to reset all your stats? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: async () => {
            try {
              await clearAllStats();
              await loadStats();
              Alert.alert("Stats Reset", "All your stats have been reset.");
            } catch (error) {
              console.error('Error resetting stats:', error);
              Alert.alert("Error", "Failed to reset stats. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const getStreakColor = (streak) => {
    if (streak >= 7) return '#ff9500'; // Gold for 7+ days
    if (streak >= 3) return '#34c759'; // Green for 3-6 days
    return '#007aff'; // Blue for 1-2 days
  };

  const renderActivityCard = (title, icon, stats, iconType = 'material') => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {iconType === 'material' ? (
            <MaterialIcons name={icon} size={24} color="#007aff" style={styles.cardIcon} />
          ) : (
            <MaterialCommunityIcons name={icon} size={24} color="#007aff" style={styles.cardIcon} />
          )}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.count}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: getStreakColor(stats.streak) }]}>
              {stats.streak}
            </Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.uniqueDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
        </View>
        
        <View style={styles.weeklyContainer}>
          <Text style={styles.weeklyTitle}>Last 7 Days</Text>
          <View style={styles.weeklyTracker}>
            {stats.last7Days.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View 
                  style={[
                    styles.dayIndicator, 
                    day.completed ? styles.dayCompleted : styles.dayMissed
                  ]}
                />
                <Text style={styles.dayLabel}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Your Flexibility Stats</Text>
        
        {renderActivityCard('Stretching', 'accessibility', stats.stretch, 'material')}
        {renderActivityCard('Yoga', 'yoga', stats.yoga, 'community')}
        {renderActivityCard('Vertical Jump', 'fitness-center', stats.jump, 'material')}
        
        <View style={styles.totalStatsCard}>
          <Text style={styles.totalStatsTitle}>Overall Progress</Text>
          
          <View style={styles.totalStatsRow}>
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatValue}>
                {stats.stretch.count + stats.yoga.count + stats.jump.count}
              </Text>
              <Text style={styles.totalStatLabel}>Total Activities</Text>
            </View>
            
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatValue}>
                {Math.max(stats.stretch.streak, stats.yoga.streak, stats.jump.streak)}
              </Text>
              <Text style={styles.totalStatLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetStats}
        >
          <Text style={styles.resetButtonText}>Reset All Stats</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007aff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weeklyContainer: {
    paddingTop: 8,
  },
  weeklyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  weeklyTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  dayCompleted: {
    backgroundColor: '#34c759',
  },
  dayMissed: {
    backgroundColor: '#e0e0e0',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
  totalStatsCard: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  totalStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  totalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalStatItem: {
    alignItems: 'center',
  },
  totalStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StatsScreen;
