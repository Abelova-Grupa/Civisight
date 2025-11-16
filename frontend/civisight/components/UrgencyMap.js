import {MapView} from '@maplibre/maplibre-react-native';

const UrgencyMap = () => {

  const urgencyData = [
  { lat: 37.78825, lng: -122.4324, weight: 0.8 },
  { lat: 37.78925, lng: -122.4314, weight: 0.95 },
  { lat: 37.78525, lng: -122.4284, weight: 0.5 },
    ];
  const geoJsonData = {
    type: 'FeatureCollection',
    features: urgencyData.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.lng, item.lat],
      },
      properties: {
        urgency_weight: item.weight, 
      },
    })),
  };

  const fetchLocation = async () => {
        setLocationAddress("Fetching location...");
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status !== "granted") {
            setLocationAddress("Location permission denied.");
            return;
          }
  
          // High accuracy to pinpoint the problem spot
          const locationResult = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setLocation(locationResult);
  
          // Reverse geocode to get a readable address
          const geocode = await Location.reverseGeocodeAsync({
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude,
          });
  
          if (geocode && geocode.length > 0) {
            const address = geocode[0];
            setLocationAddress(
              `${address.street || ""}, ${
                address.city || address.subregion || ""
              }, ${address.region || ""}`
            );
          } else {
            setLocationAddress(
              "Location found, but address could not be resolved."
            );
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationAddress("Could not get location. Check device settings.");
        }
      };

  return (
      <MapView style={{ flex: 1 }}
      sty>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[-122.4194, 37.7749]} // Example: San Francisco
        />
        <MapboxGL.ShapeSource id="urgencyData" shape={geoJsonData}>
          <MapboxGL.HeatmapLayer
            id="urgencyHeatmap"
            sourceID="urgencyData"
            // Define how to calculate the heatmap intensity from the data
            style={{
              heatmapWeight: [
                'interpolate', ['linear'], ['get', 'urgency_weight'],
                0, 0, // Weight 0 for urgency 0
                1, 10, // Weight 10 for max urgency 1
              ],
              // Define the color gradient (low urgency to high urgency)
              heatmapColor: [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)', // Transparent Blue (low)
                0.5, 'yellow', // Yellow (medium)
                1, 'red', // Red (high)
              ],
              heatmapRadius: 15,
              heatmapOpacity: 0.8,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapView>
  );
};

export default UrgencyMap