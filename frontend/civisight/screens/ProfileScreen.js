import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Podaci za simulaciju ---
const userData = {
  name: "Luka Dervišević",
  location: "Belgrade, Serbia",
  posts: 125, // Promenjeno iz AVG. rating
  rank: "Top 15%",
  nextRankProgress: 0.75, // 75% popunjenosti
  nextRankGoal: 200, // Cilj za sledeći rank
};

// --- Komponenta za profil ekran ---
const ProfileScreen = () => {
  const currentProgress = Math.round(userData.nextRankProgress * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header and Notification Icon */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </View>

        {/* Profile Card Background */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {/* Avatara Image - Replace with your actual image source */}
            <Image 
              source={{ uri: 'https://i.imgur.com/G5iM87h.png' }} // Placeholder image 
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.name}>{userData.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#888" />
            <Text style={styles.locationText}>{userData.location}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            {/* STAT 1: Number of Posts */}
            <View style={styles.statBox}>
              <Ionicons name="document-text-outline" size={20} color="#ff9800" />
              <Text style={styles.statValue}>{userData.posts}</Text>
              <Text style={styles.statLabel}>Number of Posts</Text>
            </View>

            <View style={styles.statSeparator} />

            {/* STAT 2: Current Rank */}
            <View style={styles.statBox}>
              <MaterialIcons name="emoji-events" size={20} color="#ffeb3b" />
              <Text style={styles.statValue}>{userData.rank}</Text>
              <Text style={styles.statLabel}>Current Rank</Text>
            </View>
          </View>
        </View>

        {/* --- Progress Bar Section (Zamenjuje Switch to Hire Mode) --- */}
        <View style={styles.progressBarSection}>
          <Text style={styles.progressLabel}>Progress to Next Rank ({currentProgress}%)</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${currentProgress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressGoalText}>
             Goal: {userData.posts} / {userData.nextRankGoal} posts
          </Text>
        </View>

        {/* --- General Settings Section --- */}
        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.settingsList}>
          {/* 1. Profile Setting */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconText}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Profile Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* 2. Location */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconText}>
              <Ionicons name="location-outline" size={24} color="#333" />
              <Text style={styles.settingText}>Location</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          {/* 3. Manage Withdrawals (Zadržano po originalnom dizajnu) */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconText}>
              <Feather name="briefcase" size={24} color="#333" />
              <Text style={styles.settingText}>Manage Withdrawals</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom navigation */}
        <View style={{ height: 100 }} /> 
      </View>
    </SafeAreaView>
  );
};

// Pomoćna komponenta za navigaciju
const BottomNavItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <Ionicons 
      name={icon} 
      size={24} 
      color={active ? '#FF6347' : '#999'} 
    />
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- Stilovi ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  // --- Profile Card ---
  profileCard: {
    backgroundColor: '#fff3eb',
    padding: 20,
    paddingTop: 50,
    marginHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'absolute',
    top: -50, // Podignuto iznad kartice
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  // --- Stats Row ---
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statSeparator: {
    width: 1,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  // --- Progress Bar ---
  progressBarSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6347',
    borderRadius: 4,
  },
  progressGoalText: {
    marginTop: 8,
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
  },
  // --- Settings List ---
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  settingsList: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  // --- Bottom Nav ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 25, // Za iPhone X i novije (SafeArea margin)
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#FF6347',
    fontWeight: 'bold',
  }
});

export default ProfileScreen;