import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Title */}
      <Text style={styles.title}>BRNGY BIN</Text>

      {/* Illustration */}
      <View style={{ width: "100%", alignItems: "center", marginVertical: 20 }}>
        <Image
          source={require("./assets/garbagetruck.png")}
          style={{ width: "100%", height: 280 }}
          resizeMode="contain"
        />
      </View>

      {/* 4 Buttons */}
      <View style={{ width: "100%", marginBottom: 150 }}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSpacing]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Waste Collection Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSpacing]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Waste Segregation Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSpacing]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Cleaning Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSpacing]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Complaint and Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Rounded Bottom Tab Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 15,
          right: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fafafa",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 30, // rounded pill
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ fontSize: 24 }}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Text style={{ fontSize: 24 }}>📢</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("chats")}>
          <Text style={{ fontSize: 24 }}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Text style={{ fontSize: 24 }}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
