import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

export default function Getstarted({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.regularText}>Welcome</Text>

      {/* Illustration */}
      <View style={{ width: "100%", alignItems: "center", marginVertical: 20 }}>
        <Image
          source={require("./assets/garbagetruck.png")} // ✅ replace with your image
          style={{ width: "100%", height: 300 }}       // big image
          resizeMode="contain"                        // full image visible
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate("Start")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
