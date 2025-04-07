import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  STRETCH_COUNT: 'stretch_count',
  STRETCH_DATES: 'stretch_dates',
  YOGA_COUNT: 'yoga_count',
  YOGA_DATES: 'yoga_dates',
  JUMP_COUNT: 'jump_count',
  JUMP_DATES: 'jump_dates',
};

// Get total count for a specific activity
export const getActivityCount = async (activity) => {
  try {
    const countKey = STORAGE_KEYS[`${activity.toUpperCase()}_COUNT`];
    const countStr = await AsyncStorage.getItem(countKey);
    return countStr ? parseInt(countStr) : 0;
  } catch (error) {
    console.error(`Error getting ${activity} count:`, error);
    return 0;
  }
};

// Increment count for a specific activity
export const incrementActivityCount = async (activity) => {
  try {
    const countKey = STORAGE_KEYS[`${activity.toUpperCase()}_COUNT`];
    const currentCount = await getActivityCount(activity);
    await AsyncStorage.setItem(countKey, (currentCount + 1).toString());
    return currentCount + 1;
  } catch (error) {
    console.error(`Error incrementing ${activity} count:`, error);
    return 0;
  }
};

// Record completion date for an activity
export const recordActivityDate = async (activity) => {
  try {
    const dateKey = STORAGE_KEYS[`${activity.toUpperCase()}_DATES`];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get existing dates
    const datesStr = await AsyncStorage.getItem(dateKey);
    const dates = datesStr ? JSON.parse(datesStr) : [];
    
    // Only add today if it's not already in the list
    if (!dates.includes(today)) {
      dates.push(today);
      await AsyncStorage.setItem(dateKey, JSON.stringify(dates));
    }
    
    return dates;
  } catch (error) {
    console.error(`Error recording ${activity} date:`, error);
    return [];
  }
};

// Get all recorded dates for an activity
export const getActivityDates = async (activity) => {
  try {
    const dateKey = STORAGE_KEYS[`${activity.toUpperCase()}_DATES`];
    const datesStr = await AsyncStorage.getItem(dateKey);
    return datesStr ? JSON.parse(datesStr) : [];
  } catch (error) {
    console.error(`Error getting ${activity} dates:`, error);
    return [];
  }
};

// Calculate current streak for an activity
export const calculateStreak = async (activity) => {
  try {
    const dates = await getActivityDates(activity);
    
    if (dates.length === 0) return 0;
    
    // Sort dates in descending order
    dates.sort((a, b) => new Date(b) - new Date(a));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format as YYYY-MM-DD
    const todayFormatted = today.toISOString().split('T')[0];
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    // Check if the most recent activity was today or yesterday
    const mostRecentDate = dates[0];
    if (mostRecentDate !== todayFormatted && mostRecentDate !== yesterdayFormatted) {
      // Streak broken - most recent activity is older than yesterday
      return 0;
    }
    
    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);
      
      const prevDateFormatted = previousDate.toISOString().split('T')[0];
      
      if (dates.includes(prevDateFormatted)) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error(`Error calculating ${activity} streak:`, error);
    return 0;
  }
};

// Get all stats for an activity
export const getActivityStats = async (activity) => {
  const count = await getActivityCount(activity);
  const streak = await calculateStreak(activity);
  const dates = await getActivityDates(activity);
  
  // Calculate total unique days
  const uniqueDays = new Set(dates).size;
  
  // Calculate activity for last 7 days
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    last7Days.push({
      date: dateStr,
      completed: dates.includes(dateStr)
    });
  }
  
  return {
    count,
    streak,
    uniqueDays,
    last7Days
  };
};

// Record a completed activity (increment count and record date)
export const recordCompletedActivity = async (activity) => {
  await incrementActivityCount(activity);
  await recordActivityDate(activity);
  
  return await getActivityStats(activity);
};

// Clear all stats (for testing/reset)
export const clearAllStats = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing stats:', error);
    return false;
  }
};
