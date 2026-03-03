import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from "./Navbar";

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed Top Section */}
      <View style={styles.fixedTopSection}>
        {/* Lowered Title Section */}
        <View style={styles.header}>
          <Image 
            source={require("./assets/garbagecan.png")} 
            style={styles.logoIcon} 
          />
          <Text style={styles.titleText}>BARANGAY BIN</Text>
        </View>

        {/* Large Fixed Picture */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("./assets/garbagetruck.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Scrollable Buttons Section */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.buttonList}>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate("CollectionSchedule")} 
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={45} color="black" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonLabel}>Waste Collection</Text>
              <Text style={styles.buttonLabel}>Schedule</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("SegregationGuide")}
          >
            <MaterialCommunityIcons name="book-open-page-variant-outline" size={45} color="black" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonLabel}>Waste Segregation Guide</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate("CleaningSchedule")} 
          >
            <MaterialCommunityIcons name="broom" size={45} color="black" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonLabel}>Cleaning Schedule</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate("ComplaintFeedback")}
          >
            <MaterialCommunityIcons name="message-draw" size={45} color="black" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonLabel}>Complaint and Feedback</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
           style={styles.menuButton}
            onPress={() => navigation.navigate("RewardSystem")}
            >
              <MaterialCommunityIcons name="medal-outline" size={45} color="black" />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonLabel}>Redeem Points</Text>
          </View>
      </TouchableOpacity>

        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4", 
  },
  fixedTopSection: {
    backgroundColor: "#C5D8A4",
    // Added extra padding here to lower the title significantly
    paddingTop: 40, 
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  illustration: {
    width: "95%",
    height: 260, // Made the picture slightly bigger
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for the floating Navbar
  },
  buttonList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  menuButton: {
    backgroundColor: "#6B8E4E",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15, // Bigger buttons
    paddingHorizontal: 20,
    borderRadius: 45,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  buttonLabel: {
    fontSize: 22,
    color: "#FFF",
    fontFamily: "serif",
    lineHeight: 26,
  },
});