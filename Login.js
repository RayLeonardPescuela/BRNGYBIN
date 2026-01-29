import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import styles from "./styles";

export default function Register() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Title */}
      <Text style={styles.title}>Log in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </View>
  );
}
