import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Navbar from "../components/Navbar";
import { useUser } from "../config/UserContext";
import { auth, db } from "../config/firebase";

export default function Profile({ navigation }) {
  const { userData } = useUser();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (userData?.profileImage) {
      setProfileImage(userData.profileImage);
    }
  }, [userData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant gallery access to change profile photo");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      
      try {
        await db.collection("users").doc(userData.uid).update({
          profileImage: imageUri,
        });
      } catch (error) {
        console.log("Error saving image:", error);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await auth.signOut();
          navigation.navigate("Start");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeaderContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="leaf" size={100} color="#7CB342" style={styles.laurelLeft} />
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={120} color="black" />
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
          <MaterialCommunityIcons name="leaf" size={100} color="#7CB342" style={styles.laurelRight} />
        </View>
        <Text style={styles.profileTitle}>Profile</Text>
        <Text style={styles.userName}>{userData?.name || "User"}</Text>
      </View>

      {/* Information Box */}
      <View style={styles.infoBox}>
        <View style={styles.inputField}>
          <Text style={styles.inputText}>{userData?.name || "User"}</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="mail-outline" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>{userData?.email || "email@example.com"}</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="star" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>{userData?.points || 0} Points</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="location-outline" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>{userData?.sitio || "No sitio set"}</Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4", // Light sage green background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileHeaderContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#000",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#6B8E4E",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  laurelLeft: {
    transform: [{ rotate: "-45deg" }],
    marginRight: -30,
    marginTop: 20,
  },
  laurelRight: {
    transform: [{ rotate: "45deg" }, { scaleX: -1 }],
    marginLeft: -30,
    marginTop: 20,
  },
  profileTitle: {
    fontSize: 32,
    fontFamily: "serif",
    marginTop: -10,
  },
  userName: {
    fontSize: 28,
    fontFamily: "serif",
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: "#6B8E4E", // Medium green container
    marginHorizontal: 30,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
  },
  inputField: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  fieldIcon: {
    position: "absolute",
    left: 15,
  },
  inputText: {
    fontSize: 16,
    fontFamily: "serif",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#777F71", // Greyish button
    marginHorizontal: 80,
    marginTop: 30,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#000",
    fontSize: 28,
    fontFamily: "serif",
  },
});