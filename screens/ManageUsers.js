import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import shared, { COLORS } from "../styles";

export default function ManageUsers({ navigation }) {
  const [activeTab, setActiveTab] = useState("users");

  // --- Users state ---
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // --- Sitios state (array in config/sitios) ---
  const [sitios, setSitios] = useState([]);
  const [sitiosLoading, setSitiosLoading] = useState(true);
  const [newSitioName, setNewSitioName] = useState("");
  const [addSitioLoading, setAddSitioLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSitioName, setEditSitioName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSitios();
  }, []);

  // ===================== USERS =====================

  const fetchUsers = async () => {
    try {
      const snapshot = await db.collection("users").get();
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Alert.alert("Change Role", `Make this user ${newRole}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await db.collection("users").doc(userId).update({ role: newRole });
          fetchUsers();
        },
      },
    ]);
  };

  const deleteUser = async (userId) => {
    Alert.alert("Delete User", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.collection("users").doc(userId).delete();
          fetchUsers();
        },
      },
    ]);
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userIcon}>
        <MaterialCommunityIcons name="account-circle" size={50} color="#6B8E4E" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <Text style={[styles.roleBadge, item.role === "admin" && styles.adminBadge]}>
            {item.role?.toUpperCase() || "USER"}
          </Text>
          <Text style={styles.pointsText}>{item.points || 0} pts</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleRole(item.id, item.role)}
        >
          <MaterialCommunityIcons name="account-cog" size={22} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => deleteUser(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={22} color="#E57373" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ===================== SITIOS (array in config/sitios) =====================

  const fetchSitios = async () => {
    try {
      const doc = await db.collection("config").doc("sitios").get();
      if (doc.exists) {
        setSitios(doc.data().names || []);
      } else {
        await db.collection("config").doc("sitios").set({ names: [] });
        setSitios([]);
      }
    } catch (error) {
      console.log("Error fetching sitios:", error);
    } finally {
      setSitiosLoading(false);
    }
  };

  const saveSitios = async (updatedNames) => {
    await db.collection("config").doc("sitios").set({ names: updatedNames });
    setSitios(updatedNames);
  };

  const addSitio = async () => {
    const name = newSitioName.trim();
    if (!name) {
      Alert.alert("Error", "Sitio name cannot be empty");
      return;
    }

    const duplicate = sitios.some(
      (s) => s.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Error", "A sitio with this name already exists");
      return;
    }

    setAddSitioLoading(true);
    try {
      const updated = [...sitios, name];
      await saveSitios(updated);
      setNewSitioName("");
    } catch (error) {
      console.log("Error adding sitio:", error);
      Alert.alert("Error", "Failed to add sitio");
    } finally {
      setAddSitioLoading(false);
    }
  };

  const openEditSitio = (index) => {
    setEditingIndex(index);
    setEditSitioName(sitios[index]);
    setEditModalVisible(true);
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditingIndex(null);
    setEditSitioName("");
  };

  const saveEditSitio = async () => {
    const name = editSitioName.trim();
    if (!name) {
      Alert.alert("Error", "Sitio name cannot be empty");
      return;
    }

    const duplicate = sitios.some(
      (s, i) => i !== editingIndex && s.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Error", "A sitio with this name already exists");
      return;
    }

    setSavingEdit(true);
    try {
      const updated = [...sitios];
      updated[editingIndex] = name;
      await saveSitios(updated);
      setEditModalVisible(false);
      setEditingIndex(null);
      setEditSitioName("");
    } catch (error) {
      console.log("Error updating sitio:", error);
      Alert.alert("Error", "Failed to update sitio");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteSitio = (index) => {
    Alert.alert("Delete Sitio", `Delete "${sitios[index]}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = sitios.filter((_, i) => i !== index);
            await saveSitios(updated);
          } catch (error) {
            console.log("Error deleting sitio:", error);
            Alert.alert("Error", "Failed to delete sitio");
          }
        },
      },
    ]);
  };

  const renderSitio = ({ item, index }) => (
    <View style={styles.sitioCard}>
      <View style={styles.sitioIcon}>
        <MaterialCommunityIcons name="map-marker" size={28} color={COLORS.white} />
      </View>
      <Text style={styles.sitioName}>{item}</Text>
      <View style={styles.sitioActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openEditSitio(index)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => deleteSitio(index)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#E57373" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ===================== RENDER =====================

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
      </View>
      <View style={styles.divider} />

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.tabActive]}
          onPress={() => setActiveTab("users")}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={18}
            color={activeTab === "users" ? COLORS.white : COLORS.textPrimary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.tabTextActive,
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "sitios" && styles.tabActive]}
          onPress={() => setActiveTab("sitios")}
        >
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={18}
            color={activeTab === "sitios" ? COLORS.white : COLORS.textPrimary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "sitios" && styles.tabTextActive,
            ]}
          >
            Sitios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users Tab */}
      {activeTab === "users" && (
        usersLoading ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      )}

      {/* Sitios Tab */}
      {activeTab === "sitios" && (
        <>
          {/* Add Sitio Input */}
          <View style={styles.addSitioRow}>
            <TextInput
              style={styles.addSitioInput}
              placeholder="New sitio name"
              placeholderTextColor={COLORS.textMuted}
              value={newSitioName}
              onChangeText={setNewSitioName}
            />
            <TouchableOpacity
              style={[styles.addSitioBtn, addSitioLoading && { opacity: 0.6 }]}
              onPress={addSitio}
              disabled={addSitioLoading}
            >
              {addSitioLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          {/* Sitios List */}
          {sitiosLoading ? (
            <View style={styles.center}>
              <Text style={styles.loadingText}>Loading sitios...</Text>
            </View>
          ) : sitios.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="map-marker-off" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No sitios yet</Text>
              <Text style={styles.emptySubtext}>Add a sitios above</Text>
            </View>
          ) : (
            <FlatList
              data={sitios}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSitio}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* Edit Sitio Modal */}
      <Modal visible={editModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={cancelEdit}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Sitio</Text>
            <TextInput
              style={styles.modalInput}
              value={editSitioName}
              onChangeText={setEditSitioName}
              placeholder="Sitio name"
              placeholderTextColor={COLORS.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={cancelEdit}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, savingEdit && { opacity: 0.6 }]}
                onPress={saveEditSitio}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  divider: shared.divider,
  center: shared.center,
  loadingText: shared.loadingText,
  emptyState: shared.emptyState,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,

  // Tabs
  tabRow: [shared.tabRow, { marginHorizontal: 15 }],
  tab: shared.tab,
  tabActive: shared.tabActive,
  tabText: shared.tabText,
  tabTextActive: shared.tabTextActive,

  // Users
  listContent: { paddingHorizontal: 15, paddingBottom: 40 },
  userCard: [shared.card, { flexDirection: "row", alignItems: "center", marginBottom: 12 }],
  userIcon: { marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", fontFamily: "sans-serif" },
  userEmail: { fontSize: 13, color: COLORS.textSecondary, fontFamily: "sans-serif", marginTop: 2 },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 5 },
  roleBadge: { fontSize: 10, fontWeight: "bold", color: COLORS.white, backgroundColor: "#999", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: "hidden" },
  adminBadge: { backgroundColor: COLORS.error },
  pointsText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 8 },

  // Add Sitio
  addSitioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  addSitioInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "sans-serif",
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  addSitioBtn: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  // Sitio Cards
  sitioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  sitioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sitioName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-serif",
  },
  sitioActions: {
    flexDirection: "row",
    gap: 4,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", paddingHorizontal: 20 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 20, padding: 25, zIndex: 1 },
  modalTitle: { fontSize: 22, fontWeight: "bold", fontFamily: "sans-serif", marginBottom: 15, textAlign: "center" },
  modalInput: { backgroundColor: COLORS.inputBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "sans-serif", marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, gap: 15 },
  modalCancelBtn: { flex: 1, backgroundColor: COLORS.cancelBg, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  modalCancelText: { fontWeight: "bold", fontFamily: "sans-serif", fontSize: 16 },
  modalSaveBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  modalSaveText: { color: COLORS.white, fontWeight: "bold", fontFamily: "sans-serif", fontSize: 16 },
});
