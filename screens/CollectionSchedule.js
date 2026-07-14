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
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { db } from "../config/firebase";

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

  useEffect(() => {
    fetchSchedules();
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
      <TouchableOpacity style={styles.pickupButton}>
        <MaterialCommunityIcons name="truck-delivery" size={24} color="#FFF" />
        <Text style={styles.pickupButtonText}>Pickup Request</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "serif",
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#999",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "500",
  },
  cardArea: {
    fontSize: 14,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
  cardTime: {
    fontSize: 14,
    color: "#333",
    fontFamily: "serif",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  pickupButton: {
    flexDirection: "row",
    backgroundColor: "#3E5C3E",
    margin: 20,
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pickupButtonText: {
    color: "#FFF",
    fontSize: 20,
    marginLeft: 10,
    fontFamily: "serif",
  },
});
