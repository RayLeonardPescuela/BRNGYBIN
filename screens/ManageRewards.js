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

export default function ManageRewards({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    points: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await db.collection("rewardItems").get();
      const itemList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
    } catch (error) {
      console.log("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.points) {
      Alert.alert("Error", "Please fill in name and points");
      return;
    }

    try {
      await db.collection("rewardItems").add({
        name: newItem.name,
        points: parseInt(newItem.points),
        description: newItem.description || "",
        stock: parseInt(newItem.stock) || 0,
        createdAt: new Date(),
      });
      setModalVisible(false);
      setNewItem({ name: "", points: "", description: "", stock: "" });
      fetchItems();
    } catch (error) {
      Alert.alert("Error", "Failed to add item");
    }
  };

  const deleteItem = async (itemId) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.collection("rewardItems").doc(itemId).delete();
          fetchItems();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemIcon}>
        <MaterialCommunityIcons name="gift" size={30} color="#FFF" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.description || "No description"}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemPoints}>{item.points} pts</Text>
          <Text style={styles.itemStock}>Stock: {item.stock || 0}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
        <MaterialCommunityIcons name="delete" size={22} color="#E57373" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Rewards</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* QR Generator Button */}
      <TouchableOpacity 
        style={styles.qrButton}
        onPress={() => navigation.navigate("QRGenerator")}
      >
        <MaterialCommunityIcons name="qrcode" size={30} color="#FFF" />
        <View style={styles.qrButtonText}>
          <Text style={styles.qrButtonTitle}>Generate QR Code</Text>
          <Text style={styles.qrButtonSub}>Create reward QR for users to scan</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Items List */}
      <Text style={styles.sectionTitle}>Redeemable Items</Text>
      
      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="gift-outline" size={50} color="#999" />
          <Text style={styles.loadingText}>No items yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add redeemable items</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Item Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Reward Item</Text>

            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Eco Bag"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />

            <Text style={styles.label}>Points Required *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 100"
              keyboardType="numeric"
              value={newItem.points}
              onChangeText={(text) => setNewItem({ ...newItem, points: text })}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Optional description"
              value={newItem.description}
              onChangeText={(text) => setNewItem({ ...newItem, description: text })}
            />

            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50"
              keyboardType="numeric"
              value={newItem.stock}
              onChangeText={(text) => setNewItem({ ...newItem, stock: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addItem}>
                <Text style={styles.saveBtnText}>Add Item</Text>
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
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3E5132",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    gap: 12,
  },
  qrButtonText: {
    flex: 1,
  },
  qrButtonTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  qrButtonSub: {
    color: "#C5D8A4",
    fontSize: 13,
    fontFamily: "serif",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#999",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6B8E4E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  itemDesc: {
    fontSize: 13,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: "row",
    gap: 15,
    marginTop: 5,
  },
  itemPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B8E4E",
    fontFamily: "serif",
  },
  itemStock: {
    fontSize: 13,
    color: "#999",
    fontFamily: "serif",
  },
  deleteBtn: {
    padding: 8,
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
