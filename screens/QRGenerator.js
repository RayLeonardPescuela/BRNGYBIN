import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import shared, { COLORS } from "../styles";

export default function QRGenerator({ navigation }) {
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateQR = async () => {
    if (!points || parseInt(points) <= 0) {
      Alert.alert("Error", "Please enter valid points");
      return;
    }

    setGenerating(true);
    try {
      const rewardData = {
        points: parseInt(points),
        description: description || `Reward for ${points} points`,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        used: false,
      };

      const docRef = await db.collection("rewards").add(rewardData);

      const qrPayload = JSON.stringify({
        id: docRef.id,
        points: parseInt(points),
        description: rewardData.description,
        createdAt: rewardData.createdAt.toISOString(),
        expiresAt: rewardData.expiresAt.toISOString(),
      });

      // Use QR code API to generate image
      const encodedData = encodeURIComponent(qrPayload);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`;
      
      setQrImage(qrUrl);
      setGenerated(true);
    } catch (error) {
      Alert.alert("Error", "Failed to generate QR code");
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  const resetGenerator = () => {
    setPoints("");
    setDescription("");
    setQrImage(null);
    setGenerated(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Generator</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!generated ? (
          <>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Points to Award</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 50"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={points}
                onChangeText={setPoints}
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Proper segregation reward"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity
                style={styles.generateBtn}
                onPress={generateQR}
                disabled={generating}
              >
                {generating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="qrcode" size={24} color="#FFF" />
                    <Text style={styles.generateBtnText}>Generate QR Code</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.qrSection}>
              <Text style={styles.qrTitle}>Scan this QR Code</Text>
              <Text style={styles.qrPoints}>{points} Points</Text>

              <View style={styles.qrContainer}>
                {qrImage && (
                  <Image
                    source={{ uri: qrImage }}
                    style={{ width: 250, height: 250 }}
                  />
                )}
              </View>

              <Text style={styles.qrDesc}>{description || `Reward for ${points} points`}</Text>
              <Text style={styles.qrExpiry}>Valid for 24 hours</Text>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="information" size={24} color="#4A90E2" />
                <Text style={styles.infoText}>
                  Show this QR code to users. They can scan it using the "Scan QR" button in the Reward System to earn {points} points.
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.resetBtn} onPress={resetGenerator}>
                  <MaterialCommunityIcons name="refresh" size={20} color="#333" />
                  <Text style={styles.resetBtnText}>Generate New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.container,
  header: shared.header,
  headerTitle: [shared.headerTitle, { marginLeft: 10 }],
  divider: shared.divider,
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  inputSection: { marginTop: 20 },
  label: { fontSize: 16, fontFamily: "sans-serif", fontWeight: "600", marginBottom: 8, color: COLORS.textPrimary },
  input: [shared.card, { padding: 15, marginBottom: 20 }],
  generateBtn: [shared.primaryButton, { flexDirection: "row", justifyContent: "center", gap: 10 }],
  generateBtnText: shared.primaryButtonText,
  qrSection: { alignItems: "center", marginTop: 20 },
  qrTitle: { fontSize: 22, fontFamily: "sans-serif", fontWeight: "bold", marginBottom: 5 },
  qrPoints: { fontSize: 32, fontFamily: "sans-serif", fontWeight: "bold", color: COLORS.primary, marginBottom: 20 },
  qrContainer: { backgroundColor: COLORS.white, padding: 20, borderRadius: 20, elevation: 5, marginBottom: 15 },
  qrDesc: { fontSize: 16, fontFamily: "sans-serif", color: COLORS.textSecondary, marginBottom: 5 },
  qrExpiry: { fontSize: 14, fontFamily: "sans-serif", color: COLORS.error, marginBottom: 20 },
  infoCard: { flexDirection: "row", backgroundColor: COLORS.blue, borderRadius: 15, padding: 15, marginBottom: 25, gap: 10 },
  infoText: { flex: 1, fontSize: 14, fontFamily: "sans-serif", color: COLORS.textPrimary, lineHeight: 20 },
  actions: { flexDirection: "row", gap: 15 },
  resetBtn: { flex: 1, flexDirection: "row", backgroundColor: COLORS.white, paddingVertical: 12, borderRadius: 25, justifyContent: "center", alignItems: "center", gap: 8, elevation: 2 },
  resetBtnText: { fontSize: 16, fontFamily: "sans-serif", fontWeight: "600" },
  doneBtn: [shared.primaryButton, { flex: 1, paddingVertical: 12, borderRadius: 25 }],
  doneBtnText: [shared.primaryButtonText, { fontSize: 16 }],
});
