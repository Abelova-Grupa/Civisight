
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';


const AuthScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // To show loading state on button

  const handleNavigateToRegister = () => {
    navigation.navigate('Register')
  }

  const handleLogin = async () => {
    setLoading(true);
    console.log('Attempting login with:', { username, password });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    setLoading(false);
    alert(`Login attempt for ${username}. (Check console for details)`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Unlocking Insights with <Text style={styles.highlight}>CiviSight</Text>
          </Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Authenticating...' : 'Login Securely'}
            </Text>
          </TouchableOpacity>

         <TouchableOpacity onPress={handleNavigateToRegister}>
            <Text style={styles.forgotPassword}>Don't have an account? Register!</Text>
        </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FA', // Light background for minimalistic feel
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  content: {
    width: '100%',
    maxWidth: 380, // Constrain width for larger screens/tablets
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  highlight: {
    color: '#007AFF', // A blue shade for emphasis
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0', // Light gray border
    borderWidth: 1,
    borderRadius: 12, // More rounded corners
    paddingHorizontal: 18, // Solid padding
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    shadowColor: '#000', // Optional: subtle shadow for depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF', // Blue button
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default AuthScreen;