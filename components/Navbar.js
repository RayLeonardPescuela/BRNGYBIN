import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const navItems = [
  { name: "Notification", icon: "megaphone-outline", label: "Alerts" },
  { name: "Home", icon: "home-outline", label: "Home" },
  { name: "profile", icon: "person-outline", label: "Profile" },
];

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (screenName) => route.name === screenName;

  return (
    <View style={styles.navBarContainer}>
      {navItems.map((item) => {
        const active = isActive(item.name);
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <Ionicons
              name={item.icon}
              size={26}
              color={active ? "#4A8C3F" : "#999"}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#4A8C3F",
    fontWeight: "700",
  },
});

export default Navbar;