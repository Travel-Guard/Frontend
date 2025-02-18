import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  const MenuButton = ({ icon, label, onPress, emergency = false }) => (
    <TouchableOpacity
      style={[
        styles.menuButton,
        emergency && styles.emergencyButton
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={emergency ? '#E32F45' : '#2C3E50'}
      />
      <Text style={[
        styles.menuButtonText,
        emergency && styles.emergencyButtonText
      ]}>
        {label}
      </Text>
      {emergency && (
        <View style={styles.emergencyPhone}>
          <Text style={styles.emergencyPhoneText}>911</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#34495E', '#060513']}
      locations={[0, 0.68, 1]}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield" size={28} color="#2C3E50" />
          <Text style={styles.logoText}>Travel Guardian</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-outline" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Button */}
      <MenuButton
        icon="call"
        label="Local Emergencies"
        emergency={true}
        onPress={() => {}}
      />

      {/* Main Menu Grid */}
      <View style={styles.menuGrid}>
        <View style={styles.menuRow}>
          <MenuButton 
            icon="map" 
            label="Safety Map" 
            onPress={() => router.push('/safety-map')} 
          />
          <MenuButton icon="card" label="Emergency Card" onPress={() => {}} />
        </View>
        <View style={styles.menuRow}>
          <MenuButton icon="thunderstorm" label="Crisis Watch" onPress={() => {}} />
          <MenuButton icon="people" label="Live Link" onPress={() => {}} />
        </View>
        <View style={styles.menuRow}>
          <MenuButton icon="document-text" label="Quick Notes" onPress={() => {}} />
          <MenuButton icon="shield-checkmark" label="Guardian AI" onPress={() => {}} />
        </View>
      </View>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton}>
        <Ionicons name="warning" size={40} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2C3E50',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuGrid: {
    padding: 16,
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#FFF5F5',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    marginHorizontal: 16,
  },
  emergencyButtonText: {
    color: '#E32F45',
    marginLeft: 12,
    flex: 1,
  },
  emergencyPhone: {
    backgroundColor: '#E32F45',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emergencyPhoneText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  sosButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#E32F45',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E32F45',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});