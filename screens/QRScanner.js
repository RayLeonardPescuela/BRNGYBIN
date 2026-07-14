import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";

export default function QRScanner({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { user, refreshUserData } = useUser();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      const qrPayload = JSON.parse(data);
      const { id, points, expiresAt } = qrPayload;

      // Check if expired
      if (new Date(expiresAt) < new Date()) {
        Alert.alert("Expired", "This QR code has expired.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      // Check if already used
      const rewardDoc = await db.collection("rewards").doc(id).get();
      if (!rewardDoc.exists) {
        Alert.alert("Invalid", "This QR code is not valid.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      if (rewardDoc.data().used) {
        Alert.alert("Already Used", "This QR code has already been redeemed.", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
        setLoading(false);
        return;
      }

      // Mark as used
      await db.collection("rewards").doc(id).update({ used: true });

      // Add points to user
      const userDoc = await db.collection("users").doc(user.uid).get();
      const currentPoints = userDoc.data().points || 0;
      await db.collection("users").doc(user.uid).update({
        points: currentPoints + points,
      });

      // Refresh user data
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
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Grant Permission</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "serif",
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  permText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#666",
  },
  permBtn: {
    backgroundColor: "#6B8E4E",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#6B8E4E",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  instructions: {
    padding: 25,
    alignItems: "center",
    gap: 10,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#333",
    textAlign: "center",
  },
});
