import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";

export default function ManageUsers({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

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
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Alert.alert(
      "Change Role",
      `Make this user ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await db.collection("users").doc(userId).update({ role: newRole });
            fetchUsers();
          },
        },
      ]
    );
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

  const renderItem = ({ item }) => (
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

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  userIcon: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  userEmail: {
    fontSize: 13,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#999",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  adminBadge: {
    backgroundColor: "#E57373",
  },
  pointsText: {
    fontSize: 12,
    color: "#6B8E4E",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 8,
  },
});
