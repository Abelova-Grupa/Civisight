// MainScreen.js
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import ProfileScreen from './ProfileScreen';
import SuggestionProblemScreen from './SuggestionProblemScreen';
import Posts from '../components/Posts'


// Placeholder for Posts Screen
function PostsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Posts Feed</Text>
      <Posts/>
    </View>
  );
}

// // Placeholder for Photos Screen
// function PhotosScreen() {
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.header}>Photos Gallery</Text>
//       <Text>View and upload photos.</Text>
//     </View>
//   );
// }

// // Placeholder for Profile Screen
// function ProfileScreen() {
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.header}>User Profile</Text>
//       <Text>Manage your account settings.</Text>
//     </View>
//   );
// }

// --- 2. Initialize the Tab Navigator ---
const Tab = createBottomTabNavigator();

// --- 3. MainScreen Component (The Tab Container) ---
function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Posts"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Posts') {
            iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // General styling for the tab bar labels/icons
        tabBarActiveTintColor: '#007AFF', // Use your main brand color
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Optionally hide the header on all tabs
      })}
    >
      {/* Define the screens that will appear as tabs */}
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="Report" component={SuggestionProblemScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default MainScreen;