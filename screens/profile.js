import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import Navbar from "../components/Navbar";
import { useUser } from "../config/UserContext";
import { auth, db } from "../config/firebase";
import firebase from "firebase/compat/app";
import shared, { COLORS } from "../styles";

export default function Profile({ navigation }) {
  const { user, userData, refreshUserData } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [profileSitio, setProfileSitio] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePoints, setProfilePoints] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSitio, setEditSitio] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        if (user) {
          const doc = await db.collection("users").doc(user.uid).get();
          if (doc.exists) {
            const data = doc.data();
            setProfileImage(data.profileImage || null);
            setProfileName(data.name || "");
            setProfileSitio(data.sitio || "");
            setProfileEmail(data.email || "");
            setProfilePoints(data.points || 0);
            setEditName(data.name || "");
            setEditSitio(data.sitio || "");
          }
        }
      };
      loadProfile();
    }, [user])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant gallery access to change profile photo");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      
      try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: "base64",
        });
        const storageRef = firebase.storage().ref().child(`profileImages/${user.uid}`);
        await storageRef.putString(base64, "base64", { contentType: "image/jpeg" });
        const downloadURL = await storageRef.getDownloadURL();
        
        await db.collection("users").doc(user.uid).update({
          profileImage: downloadURL,
        });
        await refreshUserData();
        setProfileImage(downloadURL);
      } catch (error) {
        console.log("Error saving image:", error);
        Alert.alert("Error", "Failed to save profile image");
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

  const startEditing = () => {
    setEditName(profileName);
    setEditSitio(profileSitio);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditName("");
    setEditSitio("");
  };

  const saveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    if (!editSitio.trim()) {
      Alert.alert("Error", "Sitio cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await db.collection("users").doc(user.uid).update({
        name: editName.trim(),
        sitio: editSitio.trim(),
      });
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        const data = doc.data();
        setProfileName(data.name || "");
        setProfileSitio(data.sitio || "");
      }
      await refreshUserData();
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        {!editing ? (
          <TouchableOpacity onPress={startEditing} style={styles.editButton}>
            <Ionicons name="create-outline" size={28} color="#4A90E2" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={cancelEditing} style={styles.editButton}>
            <Ionicons name="close-circle-outline" size={28} color="#E57373" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileHeaderContainer}>
        <View style={styles.iconWrapper}>
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
        </View>
        <Text style={styles.profileTitle}>Profile</Text>
        <Text style={styles.userName}>{editing ? editName : (profileName || "User")}</Text>
      </View>

      {/* Information Box */}
      <View style={styles.infoBox}>
        <View style={styles.inputField}>
          <Ionicons name="person-outline" size={20} color="black" style={styles.fieldIcon} />
          {editing ? (
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">{profileName || "User"}</Text>
          )}
        </View>

        <View style={styles.inputField}>
          <Ionicons name="mail-outline" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">{profileEmail || "email@example.com"}</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="star" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">{profilePoints} Points</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="location-outline" size={20} color="black" style={styles.fieldIcon} />
          {editing ? (
            <TextInput
              style={styles.editInput}
              value={editSitio}
              onChangeText={setEditSitio}
              placeholder="Sitio"
              placeholderTextColor="#999"
            />
          ) : (
            <Text style={styles.inputText} numberOfLines={1} ellipsizeMode="tail">{profileSitio || "No sitio set"}</Text>
          )}
        </View>
      </View>

      {/* Save Button (shown when editing) */}
      {editing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      )}

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
  container: shared.container,
  header: shared.header,
  editButton: { padding: 5 },
  profileHeaderContainer: { alignItems: "center", marginTop: 10 },
  iconWrapper: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  imageContainer: { position: "relative" },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: COLORS.black },
  cameraIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: COLORS.primary, width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.white },
  profileTitle: { fontSize: 32, fontFamily: "sans-serif", marginTop: -10 },
  userName: { fontSize: 28, fontFamily: "sans-serif", marginTop: 5 },
  infoBox: { backgroundColor: COLORS.primary, marginHorizontal: 30, marginTop: 20, borderRadius: 25, padding: 20, alignItems: "center" },
  inputField: { backgroundColor: COLORS.white, width: "100%", height: 50, borderRadius: 25, flexDirection: "row", alignItems: "center", marginBottom: 15, paddingHorizontal: 20 },
  fieldIcon: { marginRight: 10 },
  inputText: { flex: 1, fontSize: 16, fontFamily: "sans-serif" },
  editInput: { flex: 1, fontSize: 16, fontFamily: "sans-serif", textAlign: "center", color: COLORS.textPrimary },
  saveButton: { backgroundColor: COLORS.accent, marginHorizontal: 80, marginTop: 20, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  saveText: { color: COLORS.white, fontSize: 18, fontFamily: "sans-serif", fontWeight: "bold" },
  logoutButton: { backgroundColor: "#777F71", marginHorizontal: 80, marginTop: 30, height: 55, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  logoutText: { color: COLORS.black, fontSize: 28, fontFamily: "sans-serif" },
});