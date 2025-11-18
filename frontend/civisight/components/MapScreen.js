import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
// Uvozimo samo osnovne komponente iz react-native-maps
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 
import * as Location from "expo-location";  
import * as SecureStore from 'expo-secure-store'; 


const { width, height } = Dimensions.get('window');

// PRIMJER PODATAKA

const getPinColorByUrgency = (urgency) => {
  switch (urgency) {
    case 'HIGH':
      return 'red';
    case 'MEDIUM':
      return 'orange';
    case 'LOW':
      return 'green';
    default:
      return 'purple';
  }
};

const MARKERS_ENDPOINT = "http://10.0.10.166:8080/api/map";

const getColorByCount = (count) => {
  if (count === 3) return 'rgba(255, 0, 0, 0.7)'; // Crvena (Visok intenzitet)
  if (count === 2) return 'rgba(255, 165, 0, 0.7)';
  return 'rgba(25,197,52,0.7)'; 
};

// Funkcija za dobijanje veličine (više nije potrebna za standardne markere, ali je ostavljamo ako se koristi negdje drugdje)
const getSizeByCount = (count) => {
  return 20 + Math.min(count * 2, 30); 
};


const MapScreen = () => {
  const [coords, setCoords] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [markerData, setMarkerData] = useState([])
  
  const fetchLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync(); // Traženje dozvole
          if (status !== "granted") {
            console.error("Location permission denied.");
            return null;
          }
  
          const locationResult = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          
          return {
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude
          };

        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
      };

  const fetchMarkers = async () => {
      try {
          const token = await SecureStore.getItemAsync("user_jwt");
          if (!token) {
              console.error("JWT token not found.");
              return;
          }

          const response = await fetch(MARKERS_ENDPOINT, {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              console.error("Failed to fetch markers:", response.status);
              return;
          }

          const data = await response.json();
          // Pretpostavljamo da data izgleda kao [{latitude, longitude, urgency}, ...]
          setMarkerData(data); 

      } catch (error) {
          console.error("Network error while fetching markers:", error);
      }
  };

  useEffect(() => {
    const loadLocation = async () => {
      const locationData = await fetchLocation();
      if (locationData) {
        setCoords(locationData); // Postavljanje koordinata
      }
      await fetchMarkers();

      setLoading(false);
    };
    loadLocation();
  },[]);

  
  // UVJETNO RENDERIRANJE: Prikaži loader dok se ne dohvati lokacija
  if (loading || !coords) {
    return (
      <View style={[mapStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user location...</Text>
      </View>
    );
  }
    
  // Definicija regije (sada sigurna jer 'coords' postoji)
  const INITIAL_REGION = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.05, 
    longitudeDelta: 0.05,
  };

  return (
    <View style={mapStyles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        style={mapStyles.map}
        // UKLONJENI su clusteringEnabled i renderCluster
        showsUserLocation={true} // Prikazuje plavu tačku korisnika
      >
        {/* Markeri za hitne slučajeve */}
        {markerData.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ 
                latitude: marker.latitude,
                longitude: marker.longitude
            }}
            pinColor={getPinColorByUrgency(marker.urgency)}
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