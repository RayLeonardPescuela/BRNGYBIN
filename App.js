import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartScreen from "./StartScreen"; // or App screen file
import Getstarted from "./Getstarted";
import Login from "./Login"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Getstarted" component={Getstarted} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
