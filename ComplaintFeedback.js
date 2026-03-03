import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";

export default function ComplaintFeedback({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint & Feedback</Text>
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require("./assets/garbagetruck.png")} // Ensure this image is in your assets
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="file-document-edit-outline" size={50} color="black" />
          <View style={styles.buttonTextWrapper}>
            <Text style={styles.actionText}>Write</Text>
            <Text style={styles.actionText}>Feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="pencil-box-outline" size={50} color="black" />
          <View style={styles.buttonTextWrapper}>
            <Text style={styles.actionText}>See</Text>
            <Text style={styles.actionText}>Replies</Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="eye-outline" size={50} color="black" />
          <View style={styles.buttonTextWrapper}>
            <Text style={styles.actionText}>View</Text>
            <Text style={styles.actionText}>Complain</Text>
            <Text style={styles.actionText}>History</Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4", // Light green background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "serif",
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  illustration: {
    width: "80%",
    height: 180,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  actionButton: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonTextWrapper: {
    flex: 1,
    marginLeft: 15,
  },
  actionText: {
    fontSize: 24,
    fontFamily: "serif",
    lineHeight: 28,
  },
});