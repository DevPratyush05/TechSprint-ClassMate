import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { auth, db } from "../config/firebaseConfig";
import { Linking } from "react-native";

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerForPushNotifications = async (uid) => {
    // 1. Check if on a physical device
    if (!Device.isDevice) {
      console.log("Must use physical device for push notifications");
      return null;
    }

    try {
      // 2. Request Permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission denied");
        return null;
      }

      // 4. Get the token with proper error handling
      try {
        // Get device push token
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;

        if (!token || token === "") {
          console.warn("⚠️ Empty push token received");
          return null;
        }

        console.log("✅ Push token obtained:", token.substring(0, 20) + "...");

        // 5. Save to Firestore
        try {
          await setDoc(
            doc(db, "users", uid),
            {
              pushToken: token,
              email: email.toLowerCase().trim(),
              lastLogin: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              device: Platform.OS,
            },
            { merge: true }
          );
          console.log("✅ Push token saved to Firestore successfully");
          return token;
        } catch (firestoreError) {
          console.error("❌ Firestore save error:", firestoreError.message);
          // Continue login even if Firestore fails
          return token;
        }
      } catch (tokenError) {
        // Handle Expo Go limitations gracefully
        if (
          tokenError.message.includes("getDevicePushTokenAsync") ||
          tokenError.message.includes("native device")
        ) {
          console.warn(
            "⚠️ Push notifications not available in this environment:"
          );
          console.warn(
            "This is expected in Expo Go on Android or in simulator"
          );
          console.warn("In production builds, this will work properly");
        } else {
          console.error("❌ Token generation error:", tokenError.message);
        }
        return null;
      }
    } catch (error) {
      console.error("❌ General notification error:", error.message);
      return null;
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );
      const user = userCredential.user;

      console.log("✅ Login successful for:", user.uid);

      registerForPushNotifications(user.uid)
        .then((token) => {
          if (token) {
            console.log("✅ Push notification setup completed");
          }
        })
        .catch((notificationError) => {
          console.warn(
            "⚠️ Push notification setup failed:",
            notificationError.message
          );
        });

      setLoading(false);
      navigation.replace("MainApp");
    } catch (error) {
      setLoading(false);

      let errorMessage = "Login failed. Please try again.";

      if (error.code) {
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email format.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts. Try again later.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Check your connection.";
            break;
          default:
            console.error("Login error details:", error.code, error.message);
        }
      } else {
        console.error("Login error:", error.message);
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };
  const openAdminPanel = () => {
    Linking.openURL("https://classmate-stcet.web.app");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to your ClassMate account</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="student@stcet.ac.in"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!loading}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity
          onPress={() => !loading && navigation.navigate("ForgotPassword")}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.forgotPass, loading && styles.disabledText]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            (!email.trim() || !password.trim()) && styles.buttonInactive,
          ]}
          onPress={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
          activeOpacity={0.9}
        >
          {loading ? (
            <View style={styles.buttonLoading}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonLoadingText}>Logging in...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => !loading && navigation.navigate("Register")}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.registerText, loading && styles.disabledText]}>
            Don't have an account?{" "}
            <Text style={styles.registerBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
        {/* Admin Redirect Button */}
        <TouchableOpacity
          style={{ marginTop: 30, alignSelf: "center", padding: 10 }}
          onPress={openAdminPanel}
        >
          <Text
            style={{
              color: "#94a3b8",
              fontSize: 12,
              textDecorationLine: "underline",
            }}
          >
            Are you a Teacher? Admin Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
    color: "#1f2937",
  },
  forgotPass: {
    color: "#4f46e5",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 28,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonInactive: {
    backgroundColor: "#d1d5db",
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonLoadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  registerLink: {
    alignItems: "center",
    paddingVertical: 10,
  },
  registerText: {
    color: "#6b7280",
    fontSize: 15,
  },
  registerBold: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  disabledText: {
    opacity: 0.5,
  },
  debugInfo: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
  },
  debugText: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
