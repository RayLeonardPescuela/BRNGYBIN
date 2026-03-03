import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section with Blue Double Arrow */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log in</Text>
      </View>

      <View style={styles.content}>
        {/* Illustration - Reusing the truck image from your Home/Get Started design */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("./assets/garbagetruck.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#3E2723" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#556B2F"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#3E2723" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#556B2F"
              secureTextEntry
            />
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4", // Light green background from your screenshots
  },
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "serif", // Matching the decorative font in your designs
    fontWeight: "bold",
    color: "#3E2723",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  illustration: {
    width: "80%",
    height: 200,
  },
  inputContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30, // Pill shape like your button designs
    paddingHorizontal: 20,
    height: 60,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: "serif",
    color: "#3E2723",
  },
  signInButton: {
    backgroundColor: "#6B8E4E", // Dark green from your UI theme
    width: "100%",
    paddingVertical: 15,
    borderRadius: 35,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    color: "#FFF",
    fontFamily: "serif",
    fontWeight: "bold",
  },
  forgotContainer: {
    marginTop: 20,
  },
  forgotText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#3E2723",
    textDecorationLine: "underline",
  },
});