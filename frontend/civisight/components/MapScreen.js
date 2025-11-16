import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
// Uvozite MapView iz clustering biblioteke
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 
import CustomClusterMarker from './CustomClusterMarker';

const { width, height } = Dimensions.get('window');

// PRIMJER PODATAKA
const URGENCY_DATA = [
  { id: 1, coordinate: { latitude: 37.78825, longitude: -122.4324 }, urgencyLevel: 3 },
  { id: 2, coordinate: { latitude: 37.78830, longitude: -122.4325 }, urgencyLevel: 2 },
  { id: 3, coordinate: { latitude: 37.74825, longitude: -122.4024 }, urgencyLevel: 2 },
  { id: 4, coordinate: { latitude: 37.74800, longitude: -122.4020 }, urgencyLevel: 3 },
  { id: 5, coordinate: { latitude: 37.78000, longitude: -122.4000 }, urgencyLevel: 1 },
  { id: 6, coordinate: { latitude: 37.78100, longitude: -122.4010 }, urgencyLevel: 3 },
  { id: 7, coordinate: { latitude: 37.78200, longitude: -122.4020 }, urgencyLevel: 3 },
  { id: 8, coordinate: { latitude: 37.78300, longitude: -122.4030 }, urgencyLevel: 2 },
  { id: 9, coordinate: { latitude: 37.78400, longitude: -122.4040 }, urgencyLevel: 1 },
  { id: 10, coordinate: { latitude: 37.78500, longitude: -122.4050 }, urgencyLevel: 1 },
];

const getColorByCount = (count) => {
  if (count === 3) return 'rgba(255, 0, 0, 0.7)'; // Crvena (Visok intenzitet)
  if (count === 2) return 'rgba(255, 165, 0, 0.7)';
  return 'rgba(25,197,52,0.7)'; // Narandžasta (Srednji intenzitet)
};

// Funkcija za dobijanje veličine (radijusa) na osnovu broja tačaka
const getSizeByCount = (count) => {
  // Osnovna veličina (npr. 20) + povećanje koje se skalira s brojem tačaka
  return 20 + Math.min(count * 2, 30); // Maksimalna veličina 50
};

const MapScreen = () => {
  const INITIAL_REGION = {
    latitude: 37.76,
    longitude: -122.42,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <View style={mapStyles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Preporučeno za najbolje performanse klasterisanja
        initialRegion={INITIAL_REGION}
        style={mapStyles.map}
        clusteringEnabled={true}
        // PROSLJEĐUJEMO ISPRAVLJENU KOMPONENTU
        renderCluster={CustomClusterMarker} 
      >
        {URGENCY_DATA.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            // Prikazivanje pojedinačnih markera kada NISU grupisani
            pinColor={getColorByCount(marker.urgencyLevel)}
          />
        ))}
      </MapView>
    </View>
  );
};

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
});

export default MapScreen;