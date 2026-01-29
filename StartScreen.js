import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>BARANGAY BIN</Text>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>[ Illustration goes here ]</Text>
      </View>

      <Text style={styles.tagline}>Clean barangay starts with you!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Getstarted")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
