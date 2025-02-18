import { View, Text, StyleSheet } from 'react-native';

export default function AgenciesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Agencies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#2C3E50',
  },
});