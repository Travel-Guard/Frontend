import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

const RADIUS_OPTIONS = [2, 5, 10];

type Place = {
  id: string;
  type: 'Hospital' | 'Police' | 'Pharmacy' | 'Diplomatic' | 'ATM';
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  distance?: number;
};

const MOCK_PLACES: Place[] = [
  {
    id: '1',
    type: 'Hospital',
    name: 'Hospital de Santa Maria',
    address: 'Rua dos Girassóis, 6, Lisboa, 1500-123',
    phone: '+351 215 666 999',
    lat: 38.748,
    lng: -9.161,
  },
  {
    id: '2',
    type: 'Hospital',
    name: 'Hospital de São José',
    address: 'Rua da Prata, 12, Lisboa, 1500-069',
    phone: '+351 215 333 666',
    lat: 38.745,
    lng: -9.159,
  },
];

export default function SafetyMapScreen() {
  const [selectedRadius, setSelectedRadius] = useState(2);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['All']));
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const handleTypeSelect = (type: string) => {
    const newTypes = new Set(selectedTypes);
    if (type === 'All') {
      setSelectedTypes(new Set(['All']));
    } else {
      newTypes.delete('All');
      if (newTypes.has(type)) {
        newTypes.delete(type);
        if (newTypes.size === 0) newTypes.add('All');
      } else {
        newTypes.add(type);
      }
      setSelectedTypes(newTypes);
    }
  };

  const TypeButton = ({ type, icon }: { type: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedTypes.has(type) && styles.filterButtonActive,
      ]}
      onPress={() => handleTypeSelect(type)}>
      <Ionicons
        name={icon as any}
        size={20}
        color={selectedTypes.has(type) ? '#FFFFFF' : '#2C3E50'}
      />
      <Text
        style={[
          styles.filterButtonText,
          selectedTypes.has(type) && styles.filterButtonTextActive,
        ]}>
        {type}
      </Text>
    </TouchableOpacity>
  );

  const filteredPlaces = places.filter(place => 
    selectedTypes.has('All') || selectedTypes.has(place.type)
  );

  const getMapHtml = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
        <style>
          body { margin: 0; }
          #map { height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${location?.latitude || 38.7223}, ${location?.longitude || -9.1393}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const markers = L.markerClusterGroup();
          
          ${JSON.stringify(filteredPlaces)}.forEach(place => {
            const marker = L.marker([place.lat, place.lng])
              .bindPopup(\`
                <strong>\${place.name}</strong><br>
                \${place.address}<br>
                \${place.phone ? \`<a href="tel:\${place.phone}">\${place.phone}</a>\` : ''}
              \`);
            markers.addLayer(marker);
          });

          map.addLayer(markers);

          // Draw radius circle
          const circle = L.circle([${location?.latitude || 38.7223}, ${location?.longitude || -9.1393}], {
            color: '#E32F45',
            fillColor: '#E32F45',
            fillOpacity: 0.1,
            radius: ${selectedRadius * 1000}
          }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.radiusContainer}>
          <Text style={styles.label}>Radius:</Text>
          <TouchableOpacity style={styles.radiusButton}>
            <Text style={styles.radiusButtonText}>{selectedRadius} km</Text>
            <Ionicons name="chevron-down" size={16} color="#2C3E50" />
          </TouchableOpacity>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === 'map' && styles.viewToggleButtonActive]}
            onPress={() => setViewMode('map')}>
            <Ionicons
              name="map"
              size={20}
              color={viewMode === 'map' ? '#FFFFFF' : '#2C3E50'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]}
            onPress={() => setViewMode('list')}>
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? '#FFFFFF' : '#2C3E50'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TypeButton type="All" icon="earth" />
        <TypeButton type="Hospital" icon="medical" />
        <TypeButton type="Police" icon="shield-checkmark" />
        <TypeButton type="Pharmacy" icon="medical-outline" />
        <TypeButton type="Diplomatic" icon="business" />
        <TypeButton type="ATM" icon="card" />
      </View>

      {/* Map View */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: getMapHtml() }}
            style={styles.map}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredPlaces.map(place => (
            <View key={place.id} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Ionicons
                  name={
                    place.type === 'Hospital'
                      ? 'medical'
                      : place.type === 'Police'
                      ? 'shield-checkmark'
                      : place.type === 'Pharmacy'
                      ? 'medical-outline'
                      : place.type === 'Diplomatic'
                      ? 'business'
                      : 'card'
                  }
                  size={24}
                  color="#E32F45"
                />
                <Text style={styles.listItemTitle}>{place.name}</Text>
                <Text style={styles.listItemDistance}>
                  {place.distance?.toFixed(1) || '0.9'} km away
                </Text>
              </View>
              <Text style={styles.listItemAddress}>{place.address}</Text>
              {place.phone && (
                <TouchableOpacity style={styles.listItemPhone}>
                  <Ionicons name="call" size={16} color="#007AFF" />
                  <Text style={styles.listItemPhoneText}>{place.phone}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.getDirections}>
                <Ionicons name="navigate" size={16} color="#007AFF" />
                <Text style={styles.getDirectionsText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 8,
  },
  radiusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  radiusButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: '#2C3E50',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2C3E50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginLeft: 8,
  },
  listItemDistance: {
    fontSize: 14,
    color: '#6C757D',
  },
  listItemAddress: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  listItemPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemPhoneText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  getDirections: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  getDirectionsText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
});