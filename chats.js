import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from "./Navbar";

export default function Chats({ navigation }) {
  const messages = [
    { id: "1", sender: "ARPILI", text: "na collect na tanan basura, Salamat", time: "Yesterday >" },
    { id: "2", sender: "ABUCAYAN", text: "na collect na tanan basura, Salamat", time: "Yesterday >" },
    { id: "3", sender: "ALIWANAY", text: "naay wala naapil og kuha diri.", time: "Yesterday >" },
    { id: "4", sender: "ASTURIAS", text: "na collect na tanan basura, Salamat", time: "Yesterday >" },
    { id: "5", sender: "CAMANGGAHAN 1,2,3", text: "na collect na tanan basura, Salamat", time: "Yesterday >" },
    { id: "6", sender: "CANTIBAS", text: "naay wala naapil og kuha diri.", time: "Yesterday >" },
    { id: "7", sender: "CAMBUHAWE", text: "naay wala naapil og kuha diri.", time: "Yesterday >" },
    { id: "8", sender: "COMBADO", text: "palihog ko hapit diri.", time: "Yesterday >" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem}>
      <Ionicons name="person-circle-outline" size={60} color="black" style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.sender}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.messageSnippet} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="trash-can-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // White background for the list
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#C5D8A4",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editButtonText: {
    fontSize: 18,
    fontFamily: "serif",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "serif",
  },
  listContainer: {
    paddingBottom: 100, // Space for Navbar
  },
  messageItem: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "serif",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "serif",
  },
  messageSnippet: {
    fontSize: 14,
    color: "#333",
    fontFamily: "serif",
    marginTop: 2,
  },
});