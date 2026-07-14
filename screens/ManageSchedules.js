import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";

export default function ManageSchedules({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    type: "collection",
    date: "",
    time: "",
    area: "",
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snapshot = await db.collection("schedules").orderBy("date", "desc").get();
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

  const addSchedule = async () => {
    if (!newSchedule.date || !newSchedule.time || !newSchedule.area) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await db.collection("schedules").add({
        type: newSchedule.type,
        date: newSchedule.date,
        time: newSchedule.time,
        area: newSchedule.area,
        status: "scheduled",
        createdAt: new Date(),
      });
      setModalVisible(false);
      setNewSchedule({ type: "collection", date: "", time: "", area: "" });
      fetchSchedules();
    } catch (error) {
      Alert.alert("Error", "Failed to add schedule");
    }
  };

  const deleteSchedule = async (scheduleId) => {
    Alert.alert("Delete Schedule", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.collection("schedules").doc(scheduleId).delete();
          fetchSchedules();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleIcon}>
        <MaterialCommunityIcons
          name={item.type === "collection" ? "truck" : "broom"}
          size={30}
          color="#FFF"
        />
      </View>
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleType}>
          {item.type === "collection" ? "Collection" : "Cleaning"}
        </Text>
        <Text style={styles.scheduleArea}>{item.area}</Text>
        <Text style={styles.scheduleTime}>
          {item.date} • {item.time}
        </Text>
      </View>
      <View style={styles.scheduleActions}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === "completed" ? "#4CAF50" : "#FFB74D" }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteSchedule(item.id)}>
          <MaterialCommunityIcons name="delete" size={22} color="#E57373" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Schedules</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading schedules...</Text>
        </View>
      ) : schedules.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>No schedules yet</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Schedule Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Schedule</Text>

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeBtn, newSchedule.type === "collection" && styles.typeBtnActive]}
                onPress={() => setNewSchedule({ ...newSchedule, type: "collection" })}
              >
                <Text style={[styles.typeBtnText, newSchedule.type === "collection" && styles.typeBtnTextActive]}>
                  Collection
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, newSchedule.type === "cleaning" && styles.typeBtnActive]}
                onPress={() => setNewSchedule({ ...newSchedule, type: "cleaning" })}
              >
                <Text style={[styles.typeBtnText, newSchedule.type === "cleaning" && styles.typeBtnTextActive]}>
                  Cleaning
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Date (e.g., June 28)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter date"
              value={newSchedule.date}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, date: text })}
            />

            <Text style={styles.label}>Time (e.g., 8:00 AM)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter time"
              value={newSchedule.time}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, time: text })}
            />

            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter area name"
              value={newSchedule.area}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, area: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addSchedule}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "serif",
    marginLeft: 10,
    flex: 1,
  },
  addBtn: {
    backgroundColor: "#6B8E4E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#666",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  scheduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6B8E4E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleType: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  scheduleArea: {
    fontSize: 14,
    color: "#333",
    fontFamily: "serif",
  },
  scheduleTime: {
    fontSize: 12,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
  scheduleActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: "serif",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: "serif",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  typeBtnActive: {
    backgroundColor: "#6B8E4E",
  },
  typeBtnText: {
    fontFamily: "serif",
    color: "#333",
  },
  typeBtnTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 15,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EEE",
    alignItems: "center",
  },
  cancelBtnText: {
    fontFamily: "serif",
    fontWeight: "bold",
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#6B8E4E",
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#FFF",
  },
});
