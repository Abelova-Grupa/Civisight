import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Morate uvesti MapView iz biblioteke za klasterisanje
import MapView from 'react-native-map-clustering'; 

const getColorByCount = (count) => {
  if (count > 10) return 'rgba(255, 0, 0, 0.7)'; // Crvena (Visok intenzitet)
  if (count > 5) return 'rgba(255, 165, 0, 0.7)'; // Narandžasta (Srednji intenzitet)
  return 'rgba(0, 128, 0, 0.7)'; // Zelena (Nizak intenzitet)
};

// Funkcija za dobijanje veličine (radijusa) na osnovu broja tačaka
const getSizeByCount = (count) => {
  // Osnovna veličina (npr. 20) + povećanje koje se skalira s brojem tačaka
  return 20 + Math.min(count * 2, 30); // Maksimalna veličina 50
};

const CustomClusterMarker = ({ pointCount, clusterId, coordinate, onPress }) => {
  // Korištenje dinamičkih funkcija za stil
  const size = getSizeByCount(pointCount);
  const backgroundColor = getColorByCount(pointCount);

  const style = {
    ...styles.clusterContainer,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor,
  };

  return (
    // VAŽNO: Koristimo proslijeđeni properti 'coordinate'
    <MapView.Marker 
      identifier={`cluster-${clusterId}`} 
      coordinate={coordinate} 
      onPress={onPress}
    >
      <View style={style}>
        <Text style={styles.clusterText}>{pointCount}</Text>
      </View>
    </MapView.Marker>
  );
};

// Lokalni stilovi za klaster marker
const styles = StyleSheet.create({
  clusterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  clusterText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomClusterMarker