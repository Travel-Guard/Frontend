import { View, Text, StyleSheet } from 'react-native';

export default function UpgradeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Upgrade</Text>
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