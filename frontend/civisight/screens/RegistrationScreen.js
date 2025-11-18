import  { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,  
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';


const RegistrationScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill all credentials.');
      return;
    }

    setLoading(true);
    try{
        const url = "http://10.0.10.166:8080/auth/register"
        const req = {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json' 
          },
        body: JSON.stringify({ 
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password 
        })
        }
        const res = await fetch(url,req)
        if(!res.ok) {
            throw new Error('Error while creating an account')
            return
        }

        const data = await res.json()
        // await SecureStore.setItemAsync("user_jwt",data.token)


    }catch(error) {
        console.error(error.message)
        return
    }
    setLoading(false);
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    navigation.navigate('Login')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create profile</Text>
          <Text style={styles.subtitle}>Enter data</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Register...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Already have an account? (Login)</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  content: { width: '100%', maxWidth: 380, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  
  // Stilovi za zaobljena polja (preuzeti iz AuthScreen)
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0', 
    borderWidth: 1,
    borderRadius: 12, 
    paddingHorizontal: 18, 
    fontSize: 16,
    color: '#333',
    marginBottom: 15, // Manji razmak
    elevation: 2,
  },
  
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF', // Zeleno dugme za registraciju
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  loginLink: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
});

export default RegistrationScreen;