import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import firebase from "firebase/compat/app";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";
import shared, { COLORS } from "../styles";

export default function QRScanner({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { user, userData, refreshUserData } = useUser();

  const handleGrantPermission = async () => {
    try {
      const result = await requestPermission();
      if (!result.granted && !result.canAskAgain) {
        Alert.alert(
          "Permission Denied",
          "Camera permission was permanently denied. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.log("Permission error:", error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      const qrPayload = JSON.parse(data);
      const { id, points, expiresAt } = qrPayload;

      if (new Date(expiresAt) < new Date()) {
        Alert.alert("Expired", "This QR code has expired.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      const rewardDoc = await db.collection("rewards").doc(id).get();
      if (!rewardDoc.exists) {
        Alert.alert("Invalid", "This QR code is not valid.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      const rewardData = rewardDoc.data();

      if (rewardData.scannedBy && rewardData.scannedBy.includes(user.uid)) {
        Alert.alert("Already Scanned", "You have already redeemed this QR code.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      await db.collection("rewards").doc(id).update({
        scannedBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });

      await db.collection("pointHistory").add({
        userId: user.uid,
        userName: userData?.name || "User",
        points: points,
        description: rewardDoc.data().description || "QR Code Reward",
        createdAt: new Date().toISOString(),
      });

      const userDoc = await db.collection("users").doc(user.uid).get();
      const currentPoints = userDoc.data().points || 0;
      await db.collection("users").doc(user.uid).update({
        points: currentPoints + points,
      });

      await refreshUserData();

      Alert.alert(
        "Success!",
        `You earned ${points} points!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to process QR code. Please try again.", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6B8E4E" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
        </View>
        <View style={styles.center}>
          <MaterialCommunityIcons name="camera-off" size={60} color="#999" />
          <Text style={styles.permText}>Camera permission is required</Text>
          <Text style={styles.permSubtext}>
            {permission.canAskAgain
              ? "Tap the button below to grant access"
              : "Please enable camera access in your device settings"}
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={handleGrantPermission}>
            <MaterialCommunityIcons name="camera" size={20} color="#FFF" />
            <Text style={styles.permBtnText}>
              {permission.canAskAgain ? "Grant Permission" : "Open Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        {loading ? (
          <ActivityIndicator size="large" color="#6B8E4E" />
        ) : (
          <>
            <MaterialCommunityIcons name="qrcode-scan" size={30} color="#6B8E4E" />
            <Text style={styles.instructionText}>
              Point your camera at a reward QR code
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  center: shared.center,
  permText: { fontSize: 18, fontFamily: "sans-serif", color: COLORS.textPrimary, fontWeight: "bold" },
  permSubtext: { fontSize: 14, fontFamily: "sans-serif", color: COLORS.textSecondary, textAlign: "center", paddingHorizontal: 40 },
  permBtn: { flexDirection: "row", backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, gap: 8, alignItems: "center" },
  permBtnText: { color: COLORS.white, fontSize: 16, fontFamily: "sans-serif", fontWeight: "bold" },
  cameraContainer: { flex: 1, marginHorizontal: 20, borderRadius: 20, overflow: "hidden" },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: COLORS.primary, borderRadius: 20, backgroundColor: "transparent" },
  instructions: { padding: 25, alignItems: "center", gap: 10 },
  instructionText: { fontSize: 16, fontFamily: "sans-serif", color: COLORS.textPrimary, textAlign: "center" },
});
