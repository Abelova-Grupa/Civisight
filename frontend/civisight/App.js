import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from './screens/RegistrationScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={AuthScreen}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegistrationScreen} 
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack/>
    </NavigationContainer>
  );
}

