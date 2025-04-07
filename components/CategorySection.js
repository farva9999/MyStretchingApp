import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList
} from 'react-native';

const CategorySection = ({ title, videos, renderItem }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    paddingHorizontal: 4,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  }
});

export default CategorySection;
