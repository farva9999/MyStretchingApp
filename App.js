import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Import screens
import YogaScreen from './screens/YogaScreen';
import StretchesScreen from './screens/StretchesScreen';
import VerticalJumpScreen from './screens/VerticalJumpScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
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
