import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";

const ScheduleItem = ({ icon, title, time, status, statusColor }) => (
  <View style={styles.card}>
    <View style={styles.cardLeft}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardTime}>{time}</Text>
      </View>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

export default function CollectionSchedule({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={40} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collection Schedule</Text>
      </View>

      <View style={styles.divider} />

      {/* Calendar Strip (Simplified representation) */}
      <View style={styles.calendarContainer}>
         <Text style={styles.monthText}>June</Text>
         <View style={styles.daysRow}>
            {['24', '25', '26', '27', '28', '29'].map((day, index) => (
              <View key={day} style={[styles.dayBox, day === '27' && styles.activeDayBox]}>
                <Text style={[styles.dayNum, day === '27' && styles.activeText]}>{day}</Text>
                <Text style={[styles.dayName, day === '27' && styles.activeText]}>
                  {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'][index]}
                </Text>
              </View>
            ))}
         </View>
      </View>

      {/* Task List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScheduleItem 
          icon={<FontAwesome5 name="leaf" size={30} color="#4CAF50" />}
          title="Biodegradable Waste"
          time="8:00 AM"
          status="Scheduled"
          statusColor="#4E6E4E"
        />
        <ScheduleItem 
          icon={<MaterialCommunityIcons name="bottle-wine-outline" size={30} color="#4A90E2" />}
          title="Non-Biodegradable Waste"
          time="9:30 AM"
          status="Collected"
          statusColor="#D4A017"
        />
        <ScheduleItem 
          icon={<MaterialCommunityIcons name="delete-variant" size={30} color="#333" />}
          title="E-Waste"
          time="2:00 PM"
          status="Missed"
          statusColor="#B22222"
        />
        <ScheduleItem 
          icon={<MaterialCommunityIcons name="recycle-variant" size={30} color="#66BB6A" />}
          title="Recyclable"
          time="3:30 PM"
          status="Scheduled"
          statusColor="#4E6E4E"
        />
      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity style={styles.pickupButton}>
        <MaterialCommunityIcons name="truck-delivery" size={24} color="#FFF" />
        <Text style={styles.pickupButtonText}>Pickup Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5D8A4', // Sage green background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'serif', 
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  monthText: {
    textAlign: 'center',
    color: '#66BB6A',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayBox: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  activeDayBox: {
    backgroundColor: '#4EBA8E',
  },
  dayNum: { fontWeight: 'bold' },
  dayName: { fontSize: 12, color: '#666' },
  activeText: { color: '#FFF' },
  listContent: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '500',
  },
  cardTime: {
    fontSize: 18,
    color: '#333',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickupButton: {
    flexDirection: 'row',
    backgroundColor: '#3E5C3E',
    margin: 20,
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupButtonText: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'serif',
  }
});