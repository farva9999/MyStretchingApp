import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import stretches from '../data/stretches';
import StretchDetail from './StretchDetail';

const Stack = createStackNavigator();

const StretchesOverview = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter stretches based on search query and selected filter
  const filteredStretches = stretches.filter(stretch => {
    const matchesSearch = stretch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         stretch.bodyPart.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || stretch.bodyPart === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Get unique body parts for filter buttons
  const bodyParts = [...new Set(stretches.map(stretch => stretch.bodyPart))];

  // Render filter buttons
  const renderFilterButtons = () => {
    return (
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text 
              style={[
                styles.filterButtonText,
                selectedFilter === 'all' && styles.filterButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {bodyParts.map(part => (
            <TouchableOpacity
              key={part}
              style={[
                styles.filterButton,
                selectedFilter === part && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(part)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === part && styles.filterButtonTextActive
                ]}
              >
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render individual stretch card
  const renderStretchCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, item.isPremium && styles.premiumCard]}
        onPress={() => navigation.navigate('StretchDetail', { stretch: item })}
      >
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.bodyPart.charAt(0).toUpperCase() + item.bodyPart.slice(1)} • {item.duration}s</Text>
            <Text style={styles.cardDifficulty}>
              {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
            </Text>
          </View>
          
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialIcons name="star" size={16} color="#fff" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardBottom}>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <MaterialIcons name="play-circle-filled" size={32} color="#007AFF" style={styles.playIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stretches..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainerWrapper}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text 
              style={[
                styles.filterButtonText,
                selectedFilter === 'all' && styles.filterButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {bodyParts.map(part => (
            <TouchableOpacity
              key={part}
              style={[
                styles.filterButton,
                selectedFilter === part && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(part)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === part && styles.filterButtonTextActive
                ]}
              >
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <FlatList
        data={filteredStretches}
        keyExtractor={item => item.id}
        renderItem={renderStretchCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stretches found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// Main component with navigation
const StretchesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StretchesOverview" 
        component={StretchesOverview} 
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="StretchDetail" 
        component={StretchDetail}
        options={({ route }) => ({
          title: route.params.stretch.title,
          headerBackTitleVisible: false
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterContainerWrapper: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  premiumCard: {
    borderWidth: 1,
    borderColor: '#FFCA28',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDifficulty: {
    fontSize: 13,
    color: '#666',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCA28',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDescription: {
    fontSize: 14,
    flex: 1,
    color: '#666',
    lineHeight: 20,
  },
  playIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default StretchesScreen;
