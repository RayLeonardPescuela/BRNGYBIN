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

export default function ViewComplaints({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const snapshot = await db.collection("complaints").orderBy("createdAt", "desc").get();
      const complaintList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintList);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
    await db.collection("complaints").doc(complaintId).update({ status: newStatus });
    fetchComplaints();
  };

  const deleteComplaint = async (complaintId) => {
    Alert.alert("Delete Complaint", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.collection("complaints").doc(complaintId).delete();
          fetchComplaints();
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#4CAF50";
      case "pending":
        return "#FFB74D";
      default:
        return "#999";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <MaterialCommunityIcons name="message-alert" size={24} color="#E57373" />
        <View style={styles.complaintMeta}>
          <Text style={styles.complaintUser}>{item.userName || "Anonymous"}</Text>
          <Text style={styles.complaintDate}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Unknown date"}
          </Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: "#6B8E4E20" }]}>
          <Text style={styles.typeBadgeText}>{item.type || "complaint"}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status || "pending"}</Text>
        </View>
      </View>

      <Text style={styles.complaintTitle}>{item.title}</Text>
      <Text style={styles.complaintMessage}>{item.message}</Text>

      <View style={styles.complaintActions}>
        {item.status !== "resolved" && (
          <TouchableOpacity
            style={styles.resolveBtn}
            onPress={() => updateStatus(item.id, "resolved")}
          >
            <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
            <Text style={styles.resolveBtnText}>Resolve</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteComplaint(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={18} color="#FFF" />
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
        <Text style={styles.headerTitle}>Complaints</Text>
      </View>
      <View style={styles.divider} />

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="message-check" size={60} color="#6B8E4E" />
          <Text style={styles.loadingText}>No complaints yet</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
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
    gap: 10,
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
  complaintCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  complaintMeta: {
    flex: 1,
    marginLeft: 10,
  },
  complaintUser: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  complaintDate: {
    fontSize: 12,
    color: "#666",
    fontFamily: "serif",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6B8E4E",
    textTransform: "capitalize",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "capitalize",
  },
  complaintMessage: {
    fontSize: 15,
    fontFamily: "serif",
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
  },
  complaintTitle: {
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
    marginBottom: 6,
  },
  complaintActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  resolveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  resolveBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  deleteBtn: {
    backgroundColor: "#E57373",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
});
