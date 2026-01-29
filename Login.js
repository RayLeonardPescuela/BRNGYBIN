import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function Login() {
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

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      {/* Sign In Button */}
      <TouchableOpacity 
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => navigation.navigate("Home")}  // make sure Stack.Screen name is "Home"
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
