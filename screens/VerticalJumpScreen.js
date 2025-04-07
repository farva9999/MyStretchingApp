import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerticalJumpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vertical Jump Training</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
