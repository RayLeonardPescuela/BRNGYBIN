import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useUser } from "../config/UserContext";
import { db } from "../config/firebase";

export default function AdminHome({ navigation }) {
  const { userData } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentComplaints();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnapshot = await db.collection("users").get();
      const complaintsSnapshot = await db.collection("complaints").get();

      let pendingCount = 0;
      complaintsSnapshot.docs.forEach((doc) => {
        if (doc.data().status === "pending") pendingCount++;
      });

      setStats({
        totalUsers: usersSnapshot.size,
        totalComplaints: complaintsSnapshot.size,
        pendingComplaints: pendingCount,
      });
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const fetchRecentComplaints = async () => {
    try {
      const snapshot = await db
        .collection("complaints")
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentComplaints(data);
    } catch (error) {
      console.log("Error fetching recent complaints:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{userData?.name || "Admin"}</Text>
          <Text style={styles.roleBadge}>ADMIN</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Ionicons name="person-circle-outline" size={45} color="#3E5C3E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#4A90E2" }]}>
            <MaterialCommunityIcons name="account-group" size={30} color="#FFF" />
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#E57373" }]}>
            <MaterialCommunityIcons name="message-alert" size={30} color="#FFF" />
            <Text style={styles.statValue}>{stats.totalComplaints}</Text>
            <Text style={styles.statLabel}>Complaints</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FFB74D" }]}>
            <MaterialCommunityIcons name="clock-alert" size={30} color="#FFF" />
            <Text style={styles.statValue}>{stats.pendingComplaints}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Admin Actions */}
        <Text style={styles.sectionTitle}>Admin Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ManageUsers")}
          >
            <MaterialCommunityIcons name="account-cog" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Manage{"\n"}Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ManageSchedules")}
          >
            <MaterialCommunityIcons name="calendar-edit" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Manage{"\n"}Schedules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ViewComplaints")}
          >
            <MaterialCommunityIcons name="message-text-clock" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>View{"\n"}Complaints</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ManageRewards")}
          >
            <MaterialCommunityIcons name="gift" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Manage{"\n"}Rewards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CreateNotification")}
          >
            <MaterialCommunityIcons name="bell-ring" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Send{"\n"}Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ManageAnnouncements")}
          >
            <MaterialCommunityIcons name="bullhorn" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>Manage{"\n"}Announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("Home")}
          >
            <MaterialCommunityIcons name="eye" size={36} color="#FFF" />
            <Text style={styles.gridLabel}>View as{"\n"}User</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Complaints</Text>
        {recentComplaints.length === 0 ? (
          <View style={styles.activityCard}>
            <MaterialCommunityIcons name="check-circle" size={28} color="#4CAF50" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>No complaints</Text>
              <Text style={styles.activitySub}>All clear!</Text>
            </View>
          </View>
        ) : (
          recentComplaints.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.activityCard}
              onPress={() => navigation.navigate("ViewComplaints")}
            >
              <MaterialCommunityIcons name="alert-circle" size={28} color="#E57373" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title || item.message?.substring(0, 30)}</Text>
                <Text style={styles.activitySub}>{item.userName} - {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: item.status === "resolved" ? "#4CAF50" : "#FFB74D" }]} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  roleBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#E57373",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 12,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "serif",
    color: "#FFF",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 11,
    color: "#FFF",
    fontFamily: "serif",
    marginTop: 2,
    textAlign: "center",
  },
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
    fontSize: 13,
    fontFamily: "serif",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 17,
  },
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
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
