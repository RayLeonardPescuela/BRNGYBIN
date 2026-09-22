import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { UserProvider } from "./config/UserContext";

import StartScreen from "./screens/StartScreen";
import Getstarted from "./screens/Getstarted";
import Login from "./screens/Login";
import Home from "./screens/Home";
import profile from "./screens/profile";
import chats from "./screens/chats";
import CollectionSchedule from "./screens/CollectionSchedule";
import Notification from "./screens/Notification";
import ComplaintFeedback from "./screens/ComplaintFeedback";
import SegregationGuide from "./screens/SegregationGuide";
import CleaningSchedule from "./screens/CleaningSchedule";
import RewardSystem from "./screens/RewardSystem";
import SignUp from "./screens/SignUp";
import AdminHome from "./screens/AdminHome";
import ManageUsers from "./screens/ManageUsers";
import ManageSchedules from "./screens/ManageSchedules";
import ViewComplaints from "./screens/ViewComplaints";
import QRGenerator from "./screens/QRGenerator";
import QRScanner from "./screens/QRScanner";
import ManageRewards from "./screens/ManageRewards";
import RedeemRewards from "./screens/RedeemRewards";
import CreateNotification from "./screens/CreateNotification";
import ManageAnnouncements from "./screens/ManageAnnouncements";
import DeveloperKiosk from "./screens/DeveloperKiosk";
import PointHistory from "./screens/PointHistory";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    RubikBurned: require("./assets/fonts/RubikBurned-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (Platform.OS === "android") {
    NavigationBar.setVisibilityAsync("hidden");
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar hidden />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Getstarted" component={Getstarted} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="profile" component={profile} />
          <Stack.Screen name="chats" component={chats} />
          <Stack.Screen name="CollectionSchedule" component={CollectionSchedule} />
          <Stack.Screen name="Notification" component={Notification}/>
          <Stack.Screen name="ComplaintFeedback" component={ComplaintFeedback} />
          <Stack.Screen name="SegregationGuide" component={SegregationGuide} />
          <Stack.Screen name="CleaningSchedule" component={CleaningSchedule} />
          <Stack.Screen name="RewardSystem" component={RewardSystem} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="AdminHome" component={AdminHome} />
          <Stack.Screen name="ManageUsers" component={ManageUsers} />
          <Stack.Screen name="ManageSchedules" component={ManageSchedules} />
          <Stack.Screen name="ViewComplaints" component={ViewComplaints} />
          <Stack.Screen name="QRGenerator" component={QRGenerator} />
          <Stack.Screen name="QRScanner" component={QRScanner} />
          <Stack.Screen name="ManageRewards" component={ManageRewards} />
          <Stack.Screen name="RedeemRewards" component={RedeemRewards} />
          <Stack.Screen name="CreateNotification" component={CreateNotification} />
          <Stack.Screen name="ManageAnnouncements" component={ManageAnnouncements} />
          <Stack.Screen name="DeveloperKiosk" component={DeveloperKiosk} />
          <Stack.Screen name="PointHistory" component={PointHistory} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}