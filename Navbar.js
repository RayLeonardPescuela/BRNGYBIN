import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Simplifies to one family for standard looks
import { useNavigation, useRoute } from "@react-navigation/native";

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconColor = (screenName) => (route.name === screenName ? "#4A90E2" : "black");

  return (
    <View style={styles.navBarContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={30} color={getIconColor("Home")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("chats")}>
        <Ionicons name="chatbubbles-outline" size={30} color={getIconColor("chats")} />
      </TouchableOpacity>

      {/* FIXED: Changed to Ionicons to match megaphone-outline */}
      <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
        <Ionicons 
            name="megaphone-outline" 
            size={30} 
            color={getIconColor("Notification")} 
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("profile")}>
        <Ionicons name="person-outline" size={30} color={getIconColor("profile")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export default Navbar;