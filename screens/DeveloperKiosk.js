import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import shared, { COLORS } from "../styles";

const developers = [
  {
    name: "Ray Leonard Pescuela",
    role: "Assistant Developer",
    icon: "code-tags",
  },
  {
    name: "Frankie Bayaton",
    role: "UI/UX Designer",
    icon: "palette",
  },
  {
    name: "Bless Abegail Antemaro",
    role: "Lead Developer",
    icon: "crown",
    isCenter: true,
  },
  {
    name: "Gea Aranduque",
    role: "Assistant UI/UX Designer",
    icon: "brush",
  },
  {
    name: "Rogelio Antepuesto Jr.",
    role: "Tester",
    icon: "bug-check",
  },
];

export default function DeveloperKiosk({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={35}
            color="#4A90E2"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Developers</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Meet the Team</Text>
        <Text style={styles.pageSubTitle}>BRGY BIN Development Team</Text>

        <View style={styles.teamContainer}>
          {developers.map((dev, index) => (
            <View
              key={index}
              style={[
                styles.devCard,
                dev.isCenter && styles.devCardCenter,
              ]}
            >
              <View
                style={[
                  styles.avatarCircle,
                  dev.isCenter && styles.avatarCircleCenter,
                ]}
              >
                <MaterialCommunityIcons
                  name={dev.icon}
                  size={dev.isCenter ? 40 : 30}
                  color={dev.isCenter ? "#FFD700" : "#FFF"}
                />
              </View>
              {dev.isCenter && <Text style={styles.crownBadge}>★</Text>}
              <Text
                style={[
                  styles.devName,
                  dev.isCenter && styles.devNameCenter,
                ]}
              >
                {dev.name}
              </Text>
              <Text
                style={[
                  styles.devRole,
                  dev.isCenter && styles.devRoleCenter,
                ]}
              >
                {dev.role}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerBox}>
          <MaterialCommunityIcons name="leaf" size={20} color="#6B8E4E" />
          <Text style={styles.footerText}>BRGY BIN © 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  divider: shared.divider,
  scrollContent: shared.scrollContentSmall,
  pageTitle: { fontSize: 28, fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center", marginTop: 10, color: COLORS.textDark },
  pageSubTitle: { fontSize: 14, fontFamily: "sans-serif", color: COLORS.textSecondary, textAlign: "center", marginBottom: 25 },
  teamContainer: { alignItems: "center", gap: 15 },
  devCard: { backgroundColor: COLORS.white, borderRadius: 20, paddingVertical: 20, paddingHorizontal: 25, alignItems: "center", width: "100%", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  devCardCenter: { backgroundColor: COLORS.primaryDark, paddingVertical: 28, elevation: 4 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  avatarCircleCenter: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#2E4A2E" },
  crownBadge: { fontSize: 24, color: COLORS.gold, marginBottom: 5 },
  devName: { fontSize: 17, fontFamily: "sans-serif", fontWeight: "bold", color: COLORS.textPrimary, textAlign: "center" },
  devNameCenter: { fontSize: 22, color: COLORS.white },
  devRole: { fontSize: 13, fontFamily: "sans-serif", color: COLORS.brownLight, marginTop: 3, textAlign: "center" },
  devRoleCenter: { fontSize: 15, color: COLORS.background },
  footerBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 30, paddingVertical: 15, backgroundColor: COLORS.white, borderRadius: 15 },
  footerText: { fontSize: 14, fontFamily: "sans-serif", color: COLORS.textSecondary },
});
