import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  /* ================= GLOBAL ================= */
  container: {
    flex: 1,
    backgroundColor: "#cfe1a8",
    alignItems: "center",
    justifyContent: "center", // keeps Login and other pages centered
    paddingHorizontal: 20,
  },

  // Text styles
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

  tagline: {
    fontSize: 16,
    color: "#2f3e1f",
    marginBottom: 30,
  },

  // Inputs
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  // Buttons
  button: {
    backgroundColor: "#5b7f2b",
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  buttonSpacing: {
    marginTop: 15,
  },

  // Footer
  footerText: {
    marginTop: 20,
    color: "#2f3e1f",
  },

  // Back button
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

  /* ================= HOME PAGE ================= */
  homeWrapper: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start", // override centering for Home
    paddingTop: 40,
    alignItems: "center",
  },

  homeHeader: {
    alignItems: "center",
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

  homeFixedButtons: {
    width: "100%",
    marginTop: 10,
  },

  homeScrollArea: {
    width: "100%",
    maxHeight: 150, // scrollable area height
    marginTop: 10,
  },
});

export default styles;
