import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";

export default function ComplaintFeedback({ navigation }) {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState("write");
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintType, setComplaintType] = useState("complaint");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const snapshot = await db
        .collection("complaints")
        .where("userId", "==", userData?.uid)
        .orderBy("createdAt", "desc")
        .get();

      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!complaintTitle.trim() || !complaintMessage.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await db.collection("complaints").add({
        title: complaintTitle.trim(),
        message: complaintMessage.trim(),
        type: complaintType,
        anonymous: isAnonymous,
        userId: isAnonymous ? null : userData?.uid,
        userName: isAnonymous ? "Anonymous" : userData?.name,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Your feedback has been submitted!");
      setComplaintTitle("");
      setComplaintMessage("");
      setActiveTab("history");
    } catch (error) {
      console.log("Error submitting:", error);
      Alert.alert("Error", "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "resolved") return "#4CAF50";
    if (status === "pending") return "#FF9800";
    return "#666";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={35}
            color="#4A90E2"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint & Feedback</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "write" && styles.activeTab]}
          onPress={() => setActiveTab("write")}
        >
          <MaterialCommunityIcons
            name="pencil-plus"
            size={24}
            color={activeTab === "write" ? "#FFF" : "#333"}
          />
          <Text
            style={[styles.tabText, activeTab === "write" && styles.activeTabText]}
          >
            Write
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <MaterialCommunityIcons
            name="history"
            size={24}
            color={activeTab === "history" ? "#FFF" : "#333"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "write" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Type Selector */}
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  complaintType === "complaint" && styles.typeActive,
                ]}
                onPress={() => setComplaintType("complaint")}
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color={complaintType === "complaint" ? "#FFF" : "#333"}
                />
                <Text
                  style={[
                    styles.typeText,
                    complaintType === "complaint" && styles.typeActiveText,
                  ]}
                >
                  Complaint
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  complaintType === "feedback" && styles.typeActive,
                ]}
                onPress={() => setComplaintType("feedback")}
              >
                <MaterialCommunityIcons
                  name="thumb-up-outline"
                  size={18}
                  color={complaintType === "feedback" ? "#FFF" : "#333"}
                />
                <Text
                  style={[
                    styles.typeText,
                    complaintType === "feedback" && styles.typeActiveText,
                  ]}
                >
                  Feedback
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  complaintType === "suggestion" && styles.typeActive,
                ]}
                onPress={() => setComplaintType("suggestion")}
              >
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={18}
                  color={complaintType === "suggestion" ? "#FFF" : "#333"}
                />
                <Text
                  style={[
                    styles.typeText,
                    complaintType === "suggestion" && styles.typeActiveText,
                  ]}
                >
                  Suggestion
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief title..."
              placeholderTextColor="#999"
              value={complaintTitle}
              onChangeText={setComplaintTitle}
            />

            {/* Message */}
            <Text style={styles.label}>Details</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Describe your complaint or feedback..."
              placeholderTextColor="#999"
              value={complaintMessage}
              onChangeText={setComplaintMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Anonymous Toggle */}
            <TouchableOpacity
              style={styles.anonymousRow}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <MaterialCommunityIcons
                name={isAnonymous ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={isAnonymous ? "#6B8E4E" : "#999"}
              />
              <Text style={styles.anonymousText}>Submit Anonymously</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && { opacity: 0.6 }]}
              onPress={submitComplaint}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={22} color="#FFF" />
                  <Text style={styles.submitText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.historyContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6B8E4E" style={{ marginTop: 40 }} />
          ) : complaints.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="inbox-outline" size={60} color="#999" />
              <Text style={styles.emptyText}>No complaints yet</Text>
            </View>
          ) : (
            complaints.map((item) => (
              <View key={item.id} style={styles.complaintCard}>
                <View style={styles.complaintHeader}>
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {item.type}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  />
                </View>
                <Text style={styles.complaintTitle}>{item.title}</Text>
                <Text style={styles.complaintMessage}>{item.message}</Text>
                <Text style={styles.complaintDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <View style={styles.statusRow}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status === "resolved" ? "✓ Resolved" : "⏳ Pending"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Navbar />
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
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "serif",
    marginLeft: 10,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFF",
    borderRadius: 30,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: "#6B8E4E",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#333",
  },
  activeTabText: {
    color: "#FFF",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 18,
    fontFamily: "serif",
    marginBottom: 8,
    color: "#333",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
    gap: 4,
  },
  typeActive: {
    backgroundColor: "#6B8E4E",
  },
  typeText: {
    fontSize: 13,
    fontFamily: "serif",
    color: "#333",
  },
  typeActiveText: {
    color: "#FFF",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: "serif",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  messageInput: {
    height: 140,
  },
  anonymousRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  anonymousText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#6B8E4E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  submitText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "serif",
    fontWeight: "bold",
  },
  historyContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#999",
    marginTop: 10,
  },
  complaintCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 14,
    fontFamily: "serif",
    textTransform: "capitalize",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  complaintTitle: {
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
    marginBottom: 6,
  },
  complaintMessage: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#555",
    lineHeight: 22,
    marginBottom: 10,
  },
  complaintDate: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#999",
  },
  statusRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
  },
});