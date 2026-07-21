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
import shared, { COLORS } from "../styles";

const colors = [
  { bgColor: "#3E5C3E", iconColor: "#A8D5BA" },
  { bgColor: "#6B8E4E", iconColor: "#FFD700" },
  { bgColor: "#2D5A3D", iconColor: "#87CEEB" },
  { bgColor: "#4A7C59", iconColor: "#FFB6C1" },
  { bgColor: "#5C7A3E", iconColor: "#98FB98" },
];

export default function CleaningSchedule({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snapshot = await db
        .collection("schedules")
        .where("type", "==", "cleaning")
        .get();
      const scheduleList = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        colorIndex: index % colors.length,
      }));
      setSchedules(scheduleList);
    } catch (error) {
      console.log("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlign = (index) => (index % 2 === 0 ? "left" : "right");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Schedule</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6B8E4E" />
        </View>
      ) : schedules.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="broom" size={60} color="#999" />
          <Text style={styles.emptyText}>No cleaning schedules yet</Text>
          <Text style={styles.emptySubtext}>Admin can add schedules from the admin panel</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        >
          {schedules.map((item, index) => {
            const colorSet = colors[item.colorIndex];
            const isLeft = getAlign(index) === "left";
            return (
              <View
                key={item.id}
                style={[
                  styles.circleContainer,
                  isLeft ? styles.alignLeft : styles.alignRight,
                ]}
              >
                <View
                  style={[
                    styles.taskCircle,
                    { backgroundColor: colorSet.bgColor },
                  ]}
                >
                  <View style={styles.areaTag}>
                    <MaterialCommunityIcons name="map-marker" size={14} color={colorSet.iconColor} />
                    <Text style={[styles.areaText, { color: colorSet.iconColor }]}>
                      {item.area}
                    </Text>
                  </View>

                  <View style={styles.iconRow}>
                    <MaterialCommunityIcons name="broom" size={36} color={colorSet.iconColor} />
                  </View>

                  <Text style={styles.scheduleLabel}>Cleaning Day</Text>

                  <View style={styles.timeRow}>
                    <MaterialCommunityIcons name="calendar" size={14} color="#FFF" />
                    <Text style={styles.timeText}>{item.date}</Text>
                  </View>
                  <View style={styles.timeRow}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#FFF" />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  headerContainer: { paddingTop: 40, backgroundColor: COLORS.background, zIndex: 10 },
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  divider: shared.divider,
  center: shared.center,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  taskList: { paddingTop: 20, paddingBottom: 90 },
  circleContainer: { marginVertical: 15 },
  alignLeft: { alignItems: "flex-start", paddingLeft: 20 },
  alignRight: { alignItems: "flex-end", paddingRight: 20 },
  taskCircle: { width: 220, height: 220, borderRadius: 110, justifyContent: "center", alignItems: "center", padding: 20, overflow: "hidden", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 4 },
  areaTag: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 5 },
  areaText: { fontSize: 11, fontWeight: "bold", fontFamily: "sans-serif" },
  iconRow: { marginBottom: 5 },
  scheduleLabel: { color: COLORS.white, fontSize: 11, fontFamily: "sans-serif", fontWeight: "600", marginBottom: 5, textAlign: "center" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  timeText: { color: COLORS.white, fontSize: 9, fontFamily: "sans-serif" },
});
