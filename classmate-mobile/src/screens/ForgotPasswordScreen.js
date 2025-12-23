import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      Alert.alert(
        "Check your Email",
        "A password reset link has been sent to your inbox. (Check spam folder if needed)",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      let msg = error.message;
      if (msg.includes("auth/user-not-found"))
        msg = "No account found with this email.";
      if (msg.includes("auth/invalid-email"))
        msg = "That email address looks invalid.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open-outline" size={48} color="#4f46e5" />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your college email address and we will send you a link to reset
          your password.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@stcet.ac.in"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    color: "#334155",
    fontWeight: "600",
    fontSize: 16,
  },
  content: {
    padding: 24,
    justifyContent: "center",
  },
  iconContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    backgroundColor: "#e0e7ff",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
