import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import "react-native-get-random-values"

import {v4 as uuidv4 } from 'uuid'

const SuggestionProblemScreen = () => {
  const navigation = useNavigation();

  // State variables
  const [type, setType] = useState("suggestion"); // 'suggestion' or 'problem'
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null); // Location object with coords
  const [locationAddress, setLocationAddress] = useState(
    "Fetching location..."
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // Request camera permissions (REQUIRED for taking a picture)
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera access to take pictures of problems."
        );
      }

      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  // Effect to fetch location only when 'problem' is selected
  useEffect(() => {
    if (type === "problem") {
      fetchLocation();
    } else {
      setLocation(null);
      setLocationAddress("N/A");
    }
  }, [type]);

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

  // --- Image Picker (Camera ONLY) ---
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- Handle Post Submission ---
  const handlePost = async () => {
    if (!description.trim()) {
      Alert.alert("Validation Error", "Description cannot be empty.");
      return;
    }

    if (type === "problem" && !imageUri) {
      Alert.alert("Validation Error", "Please take a picture of the problem.");
      return;
    }

    setLoading(true);

    // --- START: API Call Simulation ---
    const formData = new FormData();

    // 1. Append Text Fields
    formData.append("type", type);
    formData.append("description", description.trim());
    formData.append("locationAddress", locationAddress);
    formData.append("timestamp", new Date().toISOString());

    // Append raw coordinates if available
    if (location) {
      formData.append("latitude", location.coords.latitude);
      formData.append("longitude", location.coords.longitude);
    }

    // 2. Append Image File (Conditional on 'problem' type)
    if (type === "problem" && imageUri) {
      // You MUST provide a proper filename and MIME type for the server to recognize the file.
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1]; // e.g., 'jpg' or 'png'
      const uuid = uuidv4()
      
      formData.append("file", {
        uri: imageUri,
        name: `${uuid}.${fileType}`, 
        type: `image/${fileType}`, 
      });
    }

    try {
      const endpoint = type === "problem" ? "problems" : "issues"
      const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "POST",
        // DO NOT set the 'Content-Type' header.
        // Fetch/RN will automatically set the correct 'multipart/form-data'
        // header, including the necessary boundary, when sending a FormData object.
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Server responded with status: ${response.status}`
        );
      }

      // Handle success response (e.g., parsing token or confirmation)
      // const data = await response.json();

      Alert.alert(
        "Success",
        `${type === "problem" ? "Problem" : "Suggestion"} posted successfully!`
      );
      navigation.navigate("Main");
    } catch (error) {
      console.error("Submission Error:", error);
      Alert.alert("Error", `Failed to submit post: ${error.message}`);
    } finally {
      setLoading(false);
    }

    console.log("Submitting:", postData);
    // --- END: API Call Simulation ---

    setLoading(false);
    Alert.alert(
      "Success",
      `${type === "problem" ? "Problem" : "Suggestion"} posted successfully!`
    );
    navigation.navigate("Main");
  };

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>
        Submit {type === "problem" ? "a Problem" : "a Suggestion"}
      </Text>

      {/* Type Selection */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "suggestion" && styles.typeButtonActive,
          ]}
          onPress={() => setType("suggestion")}
        >
          <Text
            style={[
              styles.typeButtonText,
              type === "suggestion" && styles.typeButtonTextActive,
            ]}
          >
            Suggestion
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "problem" && styles.typeButtonActive,
          ]}
          onPress={() => setType("problem")}
        >
          <Text
            style={[
              styles.typeButtonText,
              type === "problem" && styles.typeButtonTextActive,
            ]}
          >
            Problem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Problem Specific Fields (Conditional) */}
      {type === "problem" && (
        <View style={styles.problemSection}>
          {/* Camera Button */}
          <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
            <Text style={styles.cameraButtonText}>Take Picture of Problem</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          {/* Map View */}
          {initialRegion ? (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
              // Disable user interaction if map is just for display
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={initialRegion}
                title="Problem Location"
                description="Taken at this spot"
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                Map loading or location unavailable...
              </Text>
            </View>
          )}

          {/* Location Text */}
          <Text style={styles.locationLabel}>Current Location:</Text>
          <Text style={styles.locationText}>{locationAddress}</Text>
        </View>
      )}

      {/* Description Input */}
      <TextInput
        style={styles.descriptionInput}
        placeholder={`Describe your ${type}...`}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
      />

      {/* Post Button */}
      <TouchableOpacity
        style={styles.postButton}
        onPress={handlePost}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postButtonText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SuggestionProblemScreen;

// --- Styles ---

const styles = StyleSheet.create({
  cameraButton: {
    backgroundColor: "#28a745", // Green
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    aspectRatio: 4 / 3, // Maintain standard photo ratio
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  mapPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    color: "#777",
    fontStyle: "italic",
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },
  descriptionInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF", // iOS Blue
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  problemSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
});
