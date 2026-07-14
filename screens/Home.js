import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import { useUser } from "../config/UserContext";
import { db } from "../config/firebase";

const defaultAnnouncements = [
  "Segregation is mandatory in our barangay!",
  "Earn points by reporting missed pickups.",
  "Community clean-up this Sunday 7AM",
];

export default function Home({ navigation }) {
  const [annIndex, setAnnIndex] = useState(0);
  const { userData, loading } = useUser();
  const [nextPickup, setNextPickup] = useState("--");
  const [totalScans, setTotalScans] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch announcements from Firestore
      const announcementsSnapshot = await db
        .collection("announcements")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      if (!announcementsSnapshot.empty) {
        const fetched = announcementsSnapshot.docs.map((doc) => doc.data().message);
        setAnnouncements(fetched);
      }

      // Fetch next pickup from schedules
      const schedulesSnapshot = await db
        .collection("schedules")
        .where("type", "==", "collection")
        .where("status", "==", "scheduled")
        .limit(1)
        .get();
      
      if (!schedulesSnapshot.empty) {
        const nextSchedule = schedulesSnapshot.docs[0].data();
        const dateStr = nextSchedule.date || "--";
        setNextPickup(dateStr);
      }

      // Fetch total scans (redemptions)
      const redemptionsSnapshot = await db.collection("redemptions").get();
      setTotalScans(redemptionsSnapshot.size);

      // Fetch recent activity (redemptions)
      const recentSnapshot = await db
        .collection("redemptions")
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();
      
      const activities = recentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentActivity(activities);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  // Redirect admin to AdminHome once userData is loaded
  useEffect(() => {
    if (!loading && userData?.role === "admin") {
      navigation.replace("AdminHome");
    }
  }, [userData, loading]);

  // Show loading while checking role
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#6B8E4E" />
        </View>
      </SafeAreaView>
    );
  }

  // If admin, don't render user home (will redirect)
  if (userData?.role === "admin") {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{userData?.name || "User"}</Text>
          {userData?.role === "admin" && (
            <TouchableOpacity onPress={() => navigation.navigate("AdminHome")}>
              <Text style={styles.adminBadge}>ADMIN PANEL</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Ionicons name="person-circle-outline" size={45} color="#3E5C3E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Announcement Banner */}
        <View style={styles.announcementBanner}>
          <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#FFF" />
          <Text style={styles.announcementText}>{announcements[annIndex]}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star-circle" size={30} color="#FFD700" />
            <Text style={styles.statValue}>{userData?.points?.toLocaleString() || "0"}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="truck-delivery" size={30} color="#4A90E2" />
            <Text style={styles.statValue}>{nextPickup}</Text>
            <Text style={styles.statLabel}>Next Pickup</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="qrcode-scan" size={30} color="#6B8E4E" />
            <Text style={styles.statValue}>{totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CollectionSchedule")}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Collection{"\n"}Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SegregationGuide")}
          >
            <MaterialCommunityIcons name="recycle" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Segregation{"\n"}Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CleaningSchedule")}
          >
            <MaterialCommunityIcons name="broom" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Cleaning{"\n"}Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ComplaintFeedback")}
          >
            <MaterialCommunityIcons name="message-draw" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Complaint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("RewardSystem")}
          >
            <MaterialCommunityIcons name="medal-outline" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Redeem{"\n"}Points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("Notification")}
          >
            <MaterialCommunityIcons name="bell-outline" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.length === 0 ? (
          <View style={styles.activityCard}>
            <MaterialCommunityIcons name="information" size={28} color="#999" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>No recent activity</Text>
              <Text style={styles.activitySub}>Scan QR codes or redeem rewards to see activity</Text>
            </View>
          </View>
        ) : (
          recentActivity.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#4CAF50" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.itemName}</Text>
                <Text style={styles.activitySub}>
                  {item.pointsSpent} points spent
                </Text>
              </View>
            </View>
          ))
        )}
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#555",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  adminBadge: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#E57373",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 90,
    paddingHorizontal: 20,
  },

  // Announcement
  announcementBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3E5C3E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    gap: 10,
  },
  announcementText: {
    flex: 1,
    color: "#FFF",
    fontSize: 15,
    fontFamily: "serif",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "serif",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 12,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  gridItem: {
    width: "30%",
    backgroundColor: "#6B8E4E",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 2,
  },
  gridLabel: {
    color: "#FFF",
    fontSize: 11,
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 14,
  },

  // Activity
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    gap: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "serif",
  },
  activitySub: {
    fontSize: 13,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
});
