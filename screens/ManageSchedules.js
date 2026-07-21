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
import shared, { COLORS } from "../styles";

export default function ManageSchedules({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
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
      if (editingSchedule) {
        await db.collection("schedules").doc(editingSchedule.id).update({
          type: newSchedule.type,
          date: newSchedule.date,
          time: newSchedule.time,
          area: newSchedule.area,
        });
      } else {
        await db.collection("schedules").add({
          type: newSchedule.type,
          date: newSchedule.date,
          time: newSchedule.time,
          area: newSchedule.area,
          status: "scheduled",
          createdAt: new Date(),
        });
      }
      setModalVisible(false);
      setEditingSchedule(null);
      setNewSchedule({ type: "collection", date: "", time: "", area: "" });
      fetchSchedules();
    } catch (error) {
      Alert.alert("Error", "Failed to save schedule");
    }
  };

  const editSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      type: schedule.type,
      date: schedule.date,
      time: schedule.time,
      area: schedule.area,
    });
    setModalVisible(true);
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
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => editSchedule(item)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteSchedule(item.id)}>
            <MaterialCommunityIcons name="delete" size={20} color="#E57373" />
          </TouchableOpacity>
        </View>
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
            <Text style={styles.modalTitle}>{editingSchedule ? "Edit Schedule" : "Add Schedule"}</Text>

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
                onPress={() => {
                  setModalVisible(false);
                  setEditingSchedule(null);
                  setNewSchedule({ type: "collection", date: "", time: "", area: "" });
                }}
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
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10, flex: 1 }],
  addBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  divider: shared.divider,
  center: shared.center,
  loadingText: shared.loadingText,
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  scheduleCard: [shared.card, { flexDirection: "row", alignItems: "center", marginBottom: 12 }],
  scheduleIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginRight: 12 },
  scheduleInfo: { flex: 1 },
  scheduleType: { fontSize: 16, fontWeight: "bold", fontFamily: "sans-serif" },
  scheduleArea: { fontSize: 14, color: COLORS.textPrimary, fontFamily: "sans-serif" },
  scheduleTime: { fontSize: 12, color: COLORS.textSecondary, fontFamily: "sans-serif", marginTop: 2 },
  scheduleActions: { alignItems: "flex-end", gap: 8 },
  actionRow: { flexDirection: "row", gap: 12 },
  statusBadge: shared.statusBadge,
  statusText: shared.statusBadgeText,
  modalOverlay: shared.modalOverlay,
  modalContent: shared.modalContent,
  modalTitle: [shared.modalTitle, { textAlign: "center" }],
  label: [shared.modalLabel, { marginTop: 10 }],
  input: shared.modalInput,
  typeRow: shared.typeRow,
  typeBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: COLORS.inputBg, alignItems: "center" },
  typeBtnActive: { backgroundColor: COLORS.primary },
  typeBtnText: { fontFamily: "sans-serif", color: COLORS.textPrimary },
  typeBtnTextActive: { color: COLORS.white, fontWeight: "bold" },
  modalActions: shared.modalActions,
  cancelBtn: shared.modalCancelBtn,
  cancelBtnText: shared.modalCancelText,
  saveBtn: shared.modalSaveBtn,
  saveBtnText: shared.modalSaveText,
});
