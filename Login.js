import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function Register() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.regularText}>Log in</Text>

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
      <TouchableOpacity 
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
