import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>BARANGAY BIN</Text>

      {/* Updated container for image */}
      <View style={{ width: "100%", alignItems: "center", marginVertical: 20 }}>
        <Image
          source={require("./assets/zerowaste.png")}
          style={{ width: "100%", height: 300 }} // ✅ fixed height works well
          resizeMode="contain" // ✅ fits entire image
        />
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
