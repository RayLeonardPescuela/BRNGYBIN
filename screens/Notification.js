import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";

export default function Notification({ navigation }) {
  const { userData } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const snapshot = await db
        .collection("notifications")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await db.collection("notifications").doc(notifId).update({ read: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.log("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);
      for (const n of unread) {
        await db.collection("notifications").doc(n.id).update({ read: true });
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.log("Error marking all as read:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "collection":
        return { name: "truck-delivery", color: "#5B86E5" };
      case "cleaning":
        return { name: "broom", color: "#6B8E4E" };
      case "alert":
        return { name: "alert-octagon", color: "#EF5350" };
      case "reward":
        return { name: "medal", color: "#FFD700" };
      default:
        return { name: "bell", color: "#5B86E5" };
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.bellContainer}>
          <MaterialCommunityIcons name="bell-badge" size={35} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Recent</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.subHeaderText}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6B8E4E"
          style={{ marginTop: 60 }}
        />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="bell-off-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {notifications.map((item) => {
            const icon = getIcon(item.type);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  !item.read && styles.unreadCard,
                ]}
                onPress={() => markAsRead(item.id)}
              >
                <MaterialCommunityIcons
                  name={icon.name}
                  size={50}
                  color={icon.color}
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.highlightText}>{item.message}</Text>
                  <Text style={styles.timeStamp}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#C5D8A4" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 32, fontFamily: "serif", flex: 1, marginLeft: 10 },
  bellContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF5350",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#444" },
  subHeader: { flexDirection: "row", justifyContent: "space-between", padding: 15 },
  subHeaderText: { fontSize: 18, color: "#556B2F", fontFamily: "serif" },
  scrollArea: { paddingHorizontal: 15, paddingBottom: 100 },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: 18, fontFamily: "serif", color: "#999", marginTop: 10 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    marginBottom: 15,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#6B8E4E",
  },
  cardIcon: { width: 50, height: 50, marginRight: 15, resizeMode: "contain" },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "500", fontFamily: "serif" },
  highlightText: { color: "#8B4513", fontSize: 14, marginTop: 4 },
  timeStamp: { textAlign: "right", color: "#888", fontSize: 12, marginTop: 5 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6B8E4E",
    alignSelf: "flex-start",
    marginTop: 5,
  },
});