import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import styles from "./styles";
import { useState } from "react";

export default function Chats({ navigation }) { // <-- add navigation
  const [chats] = useState([
    { id: "1", message: "Hi, how are you?", avatar: "👨" },
    { id: "2", message: "When is the next waste collection?", avatar: "👩" },
    { id: "3", message: "Thanks for cleaning the area!", avatar: "👨" },
    { id: "4", message: "Can you help me with segregation?", avatar: "👩" },
  ]);

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 28, marginRight: 15 }}>{item.avatar}</Text>
      <Text style={{ fontSize: 16, color: "#2f3e1f", flexShrink: 1 }}>
        {item.message}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View
        style={{
          width: "100%",
          padding: 20,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <Text style={styles.title}>Chats</Text>
      </View>

      <View
        style={{
          width: "90%",
          backgroundColor: "#5b7f2b",
          borderRadius: 20,
          padding: 15,
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

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

        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>📢</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={{ fontSize: 24 }}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
