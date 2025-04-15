import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Import screens
import YogaScreen from './screens/YogaScreen';
import StretchesScreen from './screens/StretchesScreen';
import VerticalJumpScreen from './screens/VerticalJumpScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  // Initialize and test AsyncStorage
  useEffect(() => {
    const handleStorageError = async () => {
      try {
        await AsyncStorage.setItem('test_key', 'test_value');
        await AsyncStorage.getItem('test_key');
        await AsyncStorage.removeItem('test_key');
        console.log('AsyncStorage is working properly');
      } catch (error) {
        console.error('AsyncStorage not working:', error);
        // Show a user-friendly message
        Alert.alert(
          'Storage Error',
          'There was a problem with app storage. Some features may not work properly.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    };

    handleStorageError();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type:', state.type);
      console.log('Is connected?', state.isConnected);
      
      if (!state.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'This app requires an internet connection for some features to work properly. Videos and progress tracking will still work offline.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            paddingBottom: 3,
          },
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen 
          name="Yoga" 
          component={YogaScreen} 
          options={{
            tabBarLabel: 'Yoga',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="yoga" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Stretches" 
          component={StretchesScreen} 
          options={{
            tabBarLabel: 'Stretches',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="human-handsup" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Vertical Jump" 
          component={VerticalJumpScreen} 
          options={{
            tabBarLabel: 'Jump',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="running" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
