import React, { useState } from "react";
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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";

export default function CreateNotification({ navigation }) {
  const { userData } = useUser();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("collection");
  const [submitting, setSubmitting] = useState(false);

  const types = [
    { key: "collection", label: "Collection", icon: "truck-delivery" },
    { key: "cleaning", label: "Cleaning", icon: "broom" },
    { key: "alert", label: "Alert", icon: "alert-octagon" },
    { key: "reward", label: "Reward", icon: "medal" },
    { key: "general", label: "General", icon: "bell" },
  ];

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await db.collection("notifications").add({
        title: title.trim(),
        message: message.trim(),
        type,
        sentBy: userData?.name || "Admin",
        createdAt: new Date().toISOString(),
        read: false,
      });

      Alert.alert("Success", "Notification sent to all users!");
      setTitle("");
      setMessage("");
      navigation.goBack();
    } catch (error) {
      console.log("Error sending notification:", error);
      Alert.alert("Error", "Failed to send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={35}
            color="#4A90E2"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Notification</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Type Selector */}
        <Text style={styles.label}>Notification Type</Text>
        <View style={styles.typeRow}>
          {types.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.typeButton,
                type === item.key && styles.typeActive,
              ]}
              onPress={() => setType(item.key)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={type === item.key ? "#FFF" : "#333"}
              />
              <Text
                style={[
                  styles.typeText,
                  type === item.key && styles.typeActiveText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Notification title..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        {/* Message */}
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Write your message here..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
          onPress={sendNotification}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={22} color="#FFF" />
              <Text style={styles.submitText}>Send Notification</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: "serif",
    marginBottom: 10,
    color: "#333",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    gap: 6,
  },
  typeActive: {
    backgroundColor: "#6B8E4E",
  },
  typeText: {
    fontSize: 14,
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
  submitButton: {
    backgroundColor: "#6B8E4E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    marginTop: 10,
  },
  submitText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
  },
});
