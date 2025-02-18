import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShadowVisible: true,
          headerTitle: '',
          headerLeft: () => (
            <View style={styles.logoContainer}>
              <Ionicons name="shield" size={24} color="#2C3E50" />
              <Text style={styles.logoText}>Travel Guardian</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              {pathname !== '/' && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => router.push('/')}>
                  <Ionicons name="close" size={24} color="#2C3E50" />
                </TouchableOpacity>
              )}
              {pathname === '/' && (
                <>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="person-outline" size={24} color="#2C3E50" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 0 : 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Platform.OS === 'ios' ? 0 : 16,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
});