import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Navbar from "./Navbar";

export default function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Profile Section with Laurel Wreath */}
      <View style={styles.profileHeaderContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="leaf" size={100} color="#7CB342" style={styles.laurelLeft} />
          <Ionicons name="person-circle-outline" size={120} color="black" />
          <MaterialCommunityIcons name="leaf" size={100} color="#7CB342" style={styles.laurelRight} />
        </View>
        <Text style={styles.profileTitle}>Profile</Text>
        <Text style={styles.userName}>Administrator</Text>
      </View>

      {/* Information Box */}
      <View style={styles.infoBox}>
        <View style={styles.inputField}>
          <Text style={styles.inputText}>Admin</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="mail-outline" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>Admin01@email.com</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="call" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>09924820393</Text>
        </View>

        <View style={styles.inputField}>
          <Ionicons name="location-outline" size={20} color="black" style={styles.fieldIcon} />
          <Text style={styles.inputText}>Municipality of Balamban</Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Start")}
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