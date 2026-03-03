import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const googleAccounts = [
  { id: "1", name: "Bless Abegail Antemaro", email: "blessabegaila@gmail.com" },
  { id: "2", name: "Frankie Bayaton", email: "bayatonfrankie04@gmail.com" },
  { id: "3", name: "Ray Leonard Pescuela", email: "pescuelarayleonard@gmail.com" },
  { id: "4", name: "Gea Aranduque", email: "aranduquegea@gmail.com" },
];

export default function GoogleSignIn({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Google Header */}
      <View style={styles.header}>
        <Image source={require("./assets/google_logo.png")} style={styles.googleLogo} />
        <Text style={styles.headerText}>Sign in with Google</Text>
      </View>
      <View style={styles.line} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Trash Bin Illustration */}
        <Image source={require("./assets/garbagecan.png")} style={styles.illustration} />

        <Text style={styles.titleText}>Choose an account</Text>
        <Text style={styles.subText}>
          to continue to <Text style={styles.brandText}>BRGY BIN</Text>
        </Text>

        {/* Account List */}
        <View style={styles.accountList}>
          {googleAccounts.map((account) => (
            <TouchableOpacity 
              key={account.id} 
              style={styles.accountItem}
              onPress={() => navigation.navigate("Home")}
            >
              {/* Replaced Image with Icon */}
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="account-circle" size={50} color="black" />
              </View>
              
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountEmail}>{account.email}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="account-outline" size={28} color="black" />
            </View>
            <Text style={styles.useAnotherText}>Use another account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Policy */}
        <Text style={styles.footerText}>
          Before using this app, you can review BRGY BIN's{" "}
          <Text style={styles.linkText}>privacy policy</Text> and{" "}
          <Text style={styles.linkText}>terms of service</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    paddingTop: 45 // Pushed down for status bar
  },
  googleLogo: { width: 22, height: 22, marginRight: 15 },
  headerText: { fontSize: 18, color: "#5F6368" },
  line: { height: 1, backgroundColor: "#000", width: "100%" },
  content: { paddingHorizontal: 25, alignItems: "flex-start", paddingTop: 20 },
  illustration: { width: 70, height: 70, marginBottom: 10 },
  titleText: { fontSize: 32, fontFamily: "serif", color: "#000", fontWeight: "400" },
  subText: { fontSize: 16, marginBottom: 25, marginTop: 5 },
  brandText: { color: "#7CB342", fontWeight: "bold" },
  accountList: { width: "100%", marginBottom: 30 },
  accountItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: "#CCC" 
  },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  accountInfo: { marginLeft: 15 },
  accountName: { fontSize: 16, fontWeight: "500", color: '#333' },
  accountEmail: { fontSize: 14, color: "#5F6368" },
  useAnotherText: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
  footerText: { 
    fontSize: 13, 
    color: "#000", 
    lineHeight: 18, 
    marginTop: 10,
    fontFamily: 'serif' 
  },
  linkText: { color: "#4A90E2" },
});