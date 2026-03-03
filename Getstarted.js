import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Getstarted({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("./assets/garbagetruck.png")} 
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Title */}
      <Text style={styles.welcomeTitle}>WELCOME!</Text>

      {/* Main Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Start")} // Navigate to registration
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Sign-in Section */}
<View style={styles.socialSection}>
  <View style={styles.socialIconsRow}>
    <TouchableOpacity style={styles.socialCircle}>
      <FontAwesome5 name="twitter" size={28} color="#1DA1F2" />
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.socialCircle}>
      <FontAwesome5 name="facebook" size={28} color="#4267B2" />
    </TouchableOpacity>

    {/* Updated Google Button */}
    <TouchableOpacity 
      style={styles.socialCircle} 
      onPress={() => navigation.navigate("GoogleSignIn")}
    >
      <FontAwesome5 name="google" size={28} color="#EA4335" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.socialCircle}>
      <FontAwesome5 name="apple" size={28} color="#000000" />
    </TouchableOpacity>
  </View>
  
  <Text style={styles.footerText}>Sign in with another account</Text>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4", // Light green background
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  illustration: {
    width: "90%",
    height: 280,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#3E2723", // Dark brown/black text
    fontFamily: "serif",
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
  actionButton: {
    backgroundColor: "#6B8E4E", // Dark green button color
    width: "80%",
    paddingVertical: 15,
    borderRadius: 35,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "serif",
  },
  socialSection: {
    alignItems: "center",
    width: "100%",
  },
  socialIconsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 15,
  },
  socialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent", // Icons sit directly on background in mockup
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#333",
  },
});