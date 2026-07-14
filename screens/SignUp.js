import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../config/firebase";

export default function SignUp() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sitio, setSitio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    if (!name || !email || !sitio || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (sitio.length < 2) {
      setError("Please enter a valid sitio");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const emailCheck = await db.collection("users").where("email", "==", email).get();
      if (!emailCheck.empty) {
        setError("An account with this email already exists");
        setLoading(false);
        return;
      }

      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        sitio: sitio,
        points: 0,
        role: "user",
        createdAt: new Date(),
      });

      navigation.navigate("Home");
    } catch (error) {
      let message = "Sign up failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address format";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak. Use at least 6 characters";
      } else if (error.code === "auth/network-request-failed") {
        message = "Network error. Check your connection";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={35}
            color="#4A90E2"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../assets/garbagetruck.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#3E2723"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#556B2F"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#3E2723"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#556B2F"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color="#3E2723"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Sitio"
              placeholderTextColor="#556B2F"
              autoCapitalize="words"
              value={sitio}
              onChangeText={setSitio}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color="#3E2723"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#556B2F"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#3E2723"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={24}
              color="#3E2723"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#556B2F"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#3E2723"
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#E57373" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4",
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
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#3E2723",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  illustration: {
    width: "70%",
    height: 150,
  },
  inputContainer: {
    width: "100%",
    gap: 15,
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "serif",
    color: "#3E2723",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "serif",
    color: "#C62828",
  },
  signUpButton: {
    backgroundColor: "#6B8E4E",
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
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#3E2723",
  },
  loginBold: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
