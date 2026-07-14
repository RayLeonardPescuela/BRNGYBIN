import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

export default function homescreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/garbagecan.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>BARANGAY BIN</Text>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={require("../assets/garbagetruck.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Quick Actions */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>What do you need?</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CollectionSchedule")}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>Collection{"\n"}Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SegregationGuide")}
          >
            <MaterialCommunityIcons name="book-open-page-variant-outline" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>Segregation{"\n"}Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CleaningSchedule")}
          >
            <MaterialCommunityIcons name="broom" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>Cleaning{"\n"}Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ComplaintFeedback")}
          >
            <MaterialCommunityIcons name="message-draw" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>Complaint &{"\n"}Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("RewardSystem")}
          >
            <MaterialCommunityIcons name="medal-outline" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>Redeem{"\n"}Points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("Notification")}
          >
            <MaterialCommunityIcons name="bell-outline" size={40} color="#FFF" />
            <Text style={styles.gridLabel}>{"\n"}Notifications</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 10,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  heroBanner: {
    alignItems: "center",
    marginBottom: 15,
  },
  heroImage: {
    width: "95%",
    height: 220,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "serif",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "#6B8E4E",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gridLabel: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
});
