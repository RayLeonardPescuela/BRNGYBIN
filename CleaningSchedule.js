import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";

export default function CleaningSchedule({ navigation }) {
  // Data array to make it easy to add more days/tasks
  const scheduleData = [
    {
      day: "Mon",
      title: "Street\nCleaning",
      time: "8:00 AM",
      icon: "broom",
      iconColor: "#FF8C00",
      bgColor: "#3E5132",
      align: "left",
    },
    {
      day: "Tue",
      title: "Public\nAreas",
      time: "10:00 AM",
      icon: "tree",
      iconColor: "#7CB342",
      bgColor: "#6B8E4E",
      align: "right",
    },
    {
      day: "Wed",
      title: "Canal\nDe-clogging",
      time: "9:00 AM",
      icon: "water-outline",
      iconColor: "#4A90E2",
      bgColor: "#1B3011",
      align: "left",
    },
    {
      day: "Thu",
      title: "Park\nMaintenance",
      time: "1:00 PM",
      icon: "flower",
      iconColor: "#FF69B4",
      bgColor: "#3E5132",
      align: "right",
    },
    {
      day: "Fri",
      title: "Coastal\nCleanup",
      time: "7:00 AM",
      icon: "waves",
      iconColor: "#00CED1",
      bgColor: "#6B8E4E",
      align: "left",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Lowered to avoid phone details */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Schedule</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.taskList}
      >
        {scheduleData.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.taskCircle, 
              item.align === "left" ? styles.alignLeft : styles.alignRight, 
              { backgroundColor: item.bgColor }
            ]}
          >
            <Text style={styles.taskDayLabel}>{item.day}</Text>
            
            <View style={[
              styles.taskRow, 
              item.align === "right" && { flexDirection: 'row-reverse' }
            ]}>
              <MaterialCommunityIcons name={item.icon} size={50} color={item.iconColor} />
              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>

            <Text style={styles.taskTime}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#C5D8A4" 
  },
  headerContainer: {
    paddingTop: 40, // Pushes title down away from clock/battery
    backgroundColor: "#C5D8A4",
    zIndex: 10,
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20 
  },
  headerTitle: { 
    fontSize: 26, 
    fontFamily: "serif", 
    marginLeft: 10 
  },
  divider: { 
    height: 1, 
    backgroundColor: "#000", 
    marginHorizontal: 20, 
    marginVertical: 10 
  },

  // Vertical Scroll Task Styles
  taskList: { 
    paddingTop: 20,
    paddingBottom: 120, // Space for Navbar
  },
  taskCircle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    padding: 25,
    justifyContent: "center",
    marginVertical: -30, // Creates the overlapping design
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  alignLeft: { 
    alignSelf: "flex-start", 
    marginLeft: -20 // Peeks from the left edge
  },
  alignRight: { 
    alignSelf: "flex-end", 
    marginRight: -20 // Peeks from the right edge
  },
  taskDayLabel: { 
    color: "#FFF", 
    fontSize: 34, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 5 
  },
  taskRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-evenly",
    marginVertical: 5
  },
  taskTitle: { 
    color: "#FFF", 
    fontSize: 20, 
    fontFamily: "serif", 
    textAlign: "center",
    lineHeight: 24
  },
  taskTime: { 
    color: "#FFF", 
    fontSize: 18, 
    textAlign: "center", 
    marginTop: 5,
    fontWeight: '500'
  },
});