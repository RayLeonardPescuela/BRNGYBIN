import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Profile Avatar */}
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Image
          source={require("./assets/zerowaste.png")} // replace with your avatar
          style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#fff", marginBottom: 20 }}
        />
      </View>

      {/* Dark Green Info Container */}
      <View
        style={{
          backgroundColor: "#2f3e1f",
          width: "90%",
          borderRadius: 20,
          paddingVertical: 20,
          paddingHorizontal: 15,
          alignItems: "center",
          marginBottom: 20, // slightly less to bring buttons up
        }}
      >
        {/* Name */}
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 15,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2f3e1f" }}>
            John Doe
          </Text>
        </View>

        {/* Email */}
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 15,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons name="mail-outline" size={20} color="#555" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16, color: "#555" }}>johndoe@example.com</Text>
        </View>

        {/* Phone */}
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 15,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons name="call-outline" size={20} color="#555" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16, color: "#555" }}>+63 912 345 6789</Text>
        </View>

        {/* Location */}
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 15,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="location-outline" size={20} color="#555" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16, color: "#555" }}>Brgy. San Isidro, Manila</Text>
        </View>
      </View>

      {/* Action Buttons (slightly moved up) */}
      <View style={{ width: "90%", marginBottom: 50 }}>
        <TouchableOpacity style={[styles.button, styles.buttonSpacing]}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Start")} style={[styles.button, styles.buttonSpacing]}>
          <Text style={styles.buttonText}>Logout</Text>
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
          borderRadius: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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

        <TouchableOpacity onPress={() => {}}>
          <Text style={{ fontSize: 24 }}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
