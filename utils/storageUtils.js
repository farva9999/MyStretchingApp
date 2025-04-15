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
    // Validate activity parameter
    if (!activity || typeof activity !== 'string') {
      console.error('Invalid activity parameter:', activity);
      return 0;
    }

    const activityKey = `${activity.toUpperCase()}_COUNT`;
    
    // Verify the key exists in STORAGE_KEYS
    if (!STORAGE_KEYS[activityKey]) {
      console.error(`Unknown activity type: ${activity}`);
      return 0;
    }

    const countKey = STORAGE_KEYS[activityKey];
    const countStr = await AsyncStorage.getItem(countKey);
    
    // Make sure we can parse the count
    const parsedCount = countStr ? parseInt(countStr, 10) : 0;
    return isNaN(parsedCount) ? 0 : parsedCount;
  } catch (error) {
    console.error(`Error getting ${activity} count:`, error);
    return 0;
  }
};

// Increment count for a specific activity
export const incrementActivityCount = async (activity) => {
  try {
    // Validate activity parameter
    if (!activity || typeof activity !== 'string') {
      console.error('Invalid activity parameter:', activity);
      return 0;
    }

    const activityKey = `${activity.toUpperCase()}_COUNT`;
    
    // Verify the key exists in STORAGE_KEYS
    if (!STORAGE_KEYS[activityKey]) {
      console.error(`Unknown activity type: ${activity}`);
      return 0;
    }

    const countKey = STORAGE_KEYS[activityKey];
    const currentCount = await getActivityCount(activity);
    
    // Use a try-catch block specifically for the setItem operation
    try {
      await AsyncStorage.setItem(countKey, (currentCount + 1).toString());
      return currentCount + 1;
    } catch (storageError) {
      console.error(`Error saving to AsyncStorage:`, storageError);
      // Return the current count since we couldn't increment it
      return currentCount;
    }
  } catch (error) {
    console.error(`Error incrementing ${activity} count:`, error);
    return 0;
  }
};

// Record completion date for an activity
export const recordActivityDate = async (activity) => {
  try {
    // Validate activity parameter
    if (!activity || typeof activity !== 'string') {
      console.error('Invalid activity parameter:', activity);
      return [];
    }

    const activityKey = `${activity.toUpperCase()}_DATES`;
    
    // Verify the key exists in STORAGE_KEYS
    if (!STORAGE_KEYS[activityKey]) {
      console.error(`Unknown activity type: ${activity}`);
      return [];
    }

    const dateKey = STORAGE_KEYS[activityKey];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get existing dates with error handling for JSON parsing
    let dates = [];
    try {
      const datesStr = await AsyncStorage.getItem(dateKey);
      if (datesStr) {
        dates = JSON.parse(datesStr);
        // Validate that dates is an array
        if (!Array.isArray(dates)) {
          console.error('Stored dates is not an array:', dates);
          dates = [];
        }
      }
    } catch (parseError) {
      console.error('Error parsing stored dates:', parseError);
      // Continue with an empty array if parsing fails
      dates = [];
    }
    
    // Only add today if it's not already in the list
    if (!dates.includes(today)) {
      dates.push(today);
      try {
        await AsyncStorage.setItem(dateKey, JSON.stringify(dates));
      } catch (saveError) {
        console.error('Error saving dates to AsyncStorage:', saveError);
        // Remove today from the array since we couldn't save it
        dates.pop();
      }
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
