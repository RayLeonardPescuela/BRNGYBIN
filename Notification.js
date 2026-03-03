import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from "./Navbar";

export default function Notification({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.bellContainer}>
            <MaterialCommunityIcons name="bell-badge" size={35} color="black" />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Today</Text>
        <TouchableOpacity>
          <Text style={styles.subHeaderText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.card}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1998/1998087.png' }} style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Tomorrow:</Text>
            <Text style={styles.highlightText}>Special Clean - Up Drive at 8:00 AM</Text>
            <TouchableOpacity>
                <Text style={styles.linkText}>Don’t forget to join our community clean - up event!</Text>
            </TouchableOpacity>
            <Text style={styles.timeStamp}>1h ago</Text>
          </View>
        </View>

        <View style={styles.card}>
           <MaterialCommunityIcons name="bell-ring" size={50} color="#5B86E5" style={styles.cardIcon} />
           <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Collection Reminder</Text>
            <Text style={styles.highlightText}>Non - Biodegradable pickup today at 9:00 AM</Text>
            <Text style={styles.timeStamp}>6h ago</Text>
          </View>
        </View>

        <View style={styles.card}>
           <MaterialCommunityIcons name="alert-octagon" size={50} color="#EF5350" style={styles.cardIcon} />
           <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Missed Pickup Alert</Text>
            <Text style={styles.messageText}>Waste collection was missed today.</Text>
            <Text style={styles.timeStamp}>3mins ago</Text>
          </View>
        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C5D8A4' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 32, fontFamily: 'serif', flex: 1, marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#444' },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  subHeaderText: { fontSize: 18, color: '#556B2F', fontFamily: 'serif' },
  scrollArea: { paddingHorizontal: 15, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 15, flexDirection: 'row', marginBottom: 15, elevation: 3 },
  cardIcon: { width: 60, height: 60, marginRight: 15, resizeMode: 'contain' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '500', fontFamily: 'serif' },
  highlightText: { color: '#8B4513', fontSize: 14, marginTop: 4 },
  messageText: { color: '#333', fontSize: 14, marginTop: 4 },
  linkText: { color: '#007AFF', textDecorationLine: 'underline', marginTop: 8, fontSize: 13 },
  timeStamp: { textAlign: 'right', color: '#888', fontSize: 12, marginTop: 5 },
});