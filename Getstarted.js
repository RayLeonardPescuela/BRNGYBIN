import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function Getstarted({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Welcome</Text>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>[ Illustration goes here ]</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Start")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
