import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Mock data
const userProgress = 75; // Percentage
const progressColor = userProgress > 60 ? '#10B981' : '#F59E0B'; // Green or Yellow

// --- Simple Icon Components (Placeholder for react-native-vector-icons) ---
const Icon = ({ name, color, size = 28 }) => (
    <Text style={{ fontSize: size, color: color, marginBottom: 8 }}>{name}</Text>
);
// -------------------------------------------------------------------------

const ProfileScreen = () => {
    // Handler for the three feature views (Statistics, Badges, Settings)
    const handleFeaturePress = (feature) => {   
        console.log(`Navigating to ${feature} screen.`);
        // In a real app, you would use navigation here (e.g., navigation.navigate(feature))
    };

    return (
        <View style={styles.container}>
            {/* 1. Profile Icon & Welcome Text */}
            <View style={styles.header}>
                {/* Profile Circle Icon (Placeholder Image) */}
                <View style={styles.profileIconContainer}>
                    <Image
                        source={{ uri: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=P' }}
                        style={styles.profileImage}
                        accessibilityLabel="User Profile Picture"
                    />
                </View>

                {/* Title */}
                <Text style={styles.welcomeText}>Welcome back, User!</Text>
                <Text style={styles.subtitle}>Ready for a productive day?</Text>
            </View>

            {/* 2. Progress Bar Section */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>Daily Goal Progress</Text>
                <View style={styles.progressBarWrapper}>
                    {/* The actual progress bar colored based on the percentage */}
                    <View style={[styles.progressBar, { width: `${userProgress}%`, backgroundColor: progressColor }]} />
                </View>
                <Text style={styles.progressText}>{userProgress}% Complete</Text>
            </View>

            {/* 3. Three Feature Views (in a row) */}
            <View style={styles.featuresRow}>
                {/* Statistics View */}
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => handleFeaturePress('Statistics')}
                    activeOpacity={0.7}
                >
                    <Icon name="📊" color="#3B82F6" />
                    <Text style={styles.featureTitle}>Statistics</Text>
                    <Text style={styles.featureSubtitle}>View your weekly summary.</Text>
                </TouchableOpacity>

                {/* Badges/Achievements View */}
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => handleFeaturePress('Achievements')}
                    activeOpacity={0.7}
                >
                    <Icon name="⭐" color="#F97316" />
                    <Text style={styles.featureTitle}>Badges</Text>
                    <Text style={styles.featureSubtitle}>Unlock new rewards!</Text>
                </TouchableOpacity>

                {/* Account Settings View */}
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => handleFeaturePress('Account Settings')}
                    activeOpacity={0.7}
                >
                    <Icon name="⚙️" color="#6B7280" />
                    <Text style={styles.featureTitle}>Settings</Text>
                    <Text style={styles.featureSubtitle}>Manage your profile.</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#FFFFFF',
        marginHorizontal: -20, // Extend header background to edges
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    profileIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
        borderWidth: 4,
        borderColor: '#A78BFA', // Purple border
        marginBottom: 10,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },

    // Progress Bar Section Styles
    progressContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    progressBarWrapper: {
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'right',
    },

    // Feature Row Styles
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    featureCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        width: (width - 60) / 3, // Calculate width for 3 cards + spacing
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
    featureSubtitle: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 4,
    },
    bottomSpacer: {
        flex: 1, // Pushes content to the top
    }
});

export default ProfileScreen;