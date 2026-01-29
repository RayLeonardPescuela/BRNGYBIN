import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cfe1a8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // 🔥 Rubik Burned title
  title: {
    fontFamily: "RubikBurned",
    fontSize: 32,
    color: "#060606",
    marginBottom: 10,
    letterSpacing: 2,
  },
  regularText: {
    fontFamily: "System",
    fontSize: 32,
    color: "#060606",
    marginBottom: 10,
    letterSpacing: 2,
  },

  imagePlaceholder: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    backgroundColor: "#b7cc8f",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  placeholderText: {
    color: "#2f3e1f",
    fontSize: 16,
    opacity: 0.6,
  },

  tagline: {
    fontSize: 16,
    color: "#2f3e1f",
    marginBottom: 30,
  },

  button: {
  backgroundColor: "#5b7f2b",
  paddingVertical: 15,
  borderRadius: 30,
  width: "100%",       // make button take full container width
  alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold", // OK for system font
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  footerText: {
    marginTop: 20,
    color: "#2f3e1f",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  buttonSpacing: {
  marginTop: 15,
},
  buttonScroll: {
  backgroundColor: "#5b7f2b",
  paddingVertical: 30,
  borderRadius: 30,
  width: "100%",       // make button take full container width
  alignItems: "center",
  },

});

export default styles;
