import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function Getstarted({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.regularText}>Home Page</Text>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>[ Illustration goes here ]</Text>
      </View>

      <TouchableOpacity
        style={[styles.buttonScroll, styles.buttonSpacing]}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.buttonText}>Waste Collection Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonScroll, styles.buttonSpacing]}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.buttonText}>Waste Segregation Guide</Text>
      </TouchableOpacity>

            <TouchableOpacity
        style={[styles.buttonScroll, styles.buttonSpacing]}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.buttonText}>Cleaning Schedule</Text>
      </TouchableOpacity>

            <TouchableOpacity
        style={[styles.buttonScroll, styles.buttonSpacing]}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.buttonText}>Complaint and Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}
