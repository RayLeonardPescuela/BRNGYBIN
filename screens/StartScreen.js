import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import shared, { COLORS } from "../styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={localStyles.container}>
      <StatusBar style="dark" />

      <Text style={localStyles.title}>BARANGAY BIN</Text>

      <View style={localStyles.imageContainer}>
        <Image
          source={require("../assets/zerowaste.png")}
          style={localStyles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={localStyles.tagline}>Clean barangay starts with you!</Text>

      <TouchableOpacity
        style={localStyles.button}
        onPress={() => navigation.navigate("Getstarted")}
      >
        <Text style={localStyles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "sans-serif",
    fontSize: 32,
    color: COLORS.textDark,
    marginBottom: 10,
    letterSpacing: 2,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.primaryDarker,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },
});
