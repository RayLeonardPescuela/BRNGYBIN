import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";
import shared, { COLORS } from "../styles";

const ScheduleItem = ({ icon, title, area, time, status, statusColor }) => (
  <View style={styles.card}>
    <View style={styles.cardLeft}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardArea}>{area}</Text>
        <Text style={styles.cardTime}>{time}</Text>
      </View>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

const getWasteIcon = (wasteType) => {
  switch (wasteType) {
    case "biodegradable":
      return <FontAwesome5 name="leaf" size={30} color="#4CAF50" />;
    case "non-biodegradable":
      return <MaterialCommunityIcons name="bottle-wine-outline" size={30} color="#4A90E2" />;
    case "e-waste":
      return <MaterialCommunityIcons name="delete-variant" size={30} color="#333" />;
    case "recyclable":
      return <MaterialCommunityIcons name="recycle-variant" size={30} color="#66BB6A" />;
    default:
      return <MaterialCommunityIcons name="trash-can" size={30} color="#999" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#4E6E4E";
    case "scheduled":
      return "#4A90E2";
    case "missed":
      return "#B22222";
    default:
      return "#999";
  }
};

export default function CollectionSchedule({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const { user, userData } = useUser();

  useEffect(() => {
    fetchSchedules();
    checkPendingRequest();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snapshot = await db
        .collection("schedules")
        .where("type", "==", "collection")
        .get();
      const scheduleList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSchedules(scheduleList);
    } catch (error) {
      console.log("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingRequest = async () => {
    if (!user) return;
    try {
      const snapshot = await db
        .collection("pickupRequests")
        .where("userId", "==", user.uid)
        .where("status", "==", "pending")
        .get();
      setHasPendingRequest(!snapshot.empty);
    } catch (error) {
      console.log("Error checking request:", error);
    }
  };

  const handlePickupRequest = async () => {
    if (hasPendingRequest) {
      Alert.alert("Already Requested", "You already have a pending pickup request. Please wait for it to be completed.");
      return;
    }

    Alert.alert(
      "Pickup Request",
      "Send a pickup request to the admin?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            setRequestLoading(true);
            try {
              await db.collection("pickupRequests").add({
                userId: user.uid,
                userName: userData?.name || "Unknown",
                userSitio: userData?.sitio || "No sitio",
                status: "pending",
                createdAt: new Date().toISOString(),
              });
              setHasPendingRequest(true);
              Alert.alert("Request Sent", "Your pickup request has been sent to the admin.");
            } catch (error) {
              console.log("Error sending request:", error);
              Alert.alert("Error", "Failed to send request. Try again.");
            } finally {
              setRequestLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={40} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collection Schedule</Text>
      </View>

      <View style={styles.divider} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6B8E4E" />
        </View>
      ) : schedules.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="calendar-blank" size={60} color="#999" />
          <Text style={styles.emptyText}>No collection schedules yet</Text>
          <Text style={styles.emptySubtext}>Admin can add schedules from the admin panel</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {schedules.map((item) => (
            <ScheduleItem
              key={item.id}
              icon={getWasteIcon(item.wasteType)}
              title={item.wasteType ? item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1) : "Collection"}
              area={item.area}
              time={`${item.date} • ${item.time}`}
              status={item.status}
              statusColor={getStatusColor(item.status)}
            />
          ))}
        </ScrollView>
      )}

      {/* Footer Button */}
      <TouchableOpacity
        style={[styles.pickupButton, hasPendingRequest && styles.pickupButtonPending]}
        onPress={handlePickupRequest}
        disabled={requestLoading}
      >
        {requestLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : hasPendingRequest ? (
          <>
            <MaterialCommunityIcons name="check-circle" size={24} color="#FFF" />
            <Text style={styles.pickupButtonText}>Request Sent</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="truck-delivery" size={24} color="#FFF" />
            <Text style={styles.pickupButtonText}>Pickup Request</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  divider: shared.divider,
  center: shared.center,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  card: [shared.card, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }],
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  textContainer: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: "sans-serif", fontWeight: "500" },
  cardArea: { fontSize: 14, color: COLORS.textSecondary, fontFamily: "sans-serif", marginTop: 2 },
  cardTime: { fontSize: 14, color: COLORS.textPrimary, fontFamily: "sans-serif", marginTop: 2 },
  statusBadge: [shared.statusBadge, { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }],
  statusText: [shared.statusBadgeText, { textTransform: "capitalize" }],
  pickupButton: { flexDirection: "row", backgroundColor: COLORS.primaryDark, margin: 20, padding: 15, borderRadius: 30, justifyContent: "center", alignItems: "center", gap: 10 },
  pickupButtonPending: { backgroundColor: COLORS.secondary },
  pickupButtonText: { color: COLORS.white, fontSize: 20, fontFamily: "sans-serif" },
});
