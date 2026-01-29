import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";

import StartScreen from "./StartScreen";
import Getstarted from "./Getstarted";
import Login from "./Login";
import Home from "./Home";
import profile from "./profile"
import chats from "./chats"

const Stack = createNativeStackNavigator();

export default function App() {
  // Load Rubik Burned font
  const [fontsLoaded] = useFonts({
    RubikBurned: require("./assets/fonts/RubikBurned-Regular.ttf"),
  });

  // Wait until font is loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Getstarted" component={Getstarted} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="profile" component={profile} />
        <Stack.Screen name="chats" component={chats} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
