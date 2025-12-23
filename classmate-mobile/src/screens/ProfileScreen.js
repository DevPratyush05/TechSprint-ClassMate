import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch User Data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          signOut(auth).then(() => navigation.replace("Login"));
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "S"}
            </Text>
          </View>

          <Text style={styles.name}>{userData?.name || "Student Name"}</Text>
          <Text style={styles.email}>
            {userData?.email || auth.currentUser?.email}
          </Text>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {userData?.dept || "GEN"} Dept
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {userData?.year || "1st"} Year
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Options (No Emojis, Clean Text) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Edit Details</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Notifications</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPass}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  scrollContent: { padding: 20 },

  profileCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#2563eb" },
  name: { fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  email: { fontSize: 14, color: "#64748b", marginBottom: 16 },

  badgeContainer: { flexDirection: "row", gap: 8 },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#475569" },

  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    padding: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  menuText: { fontSize: 16, color: "#334155" },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#cbd5e1",
    transform: [{ rotate: "45deg" }],
  },
  forgotPass: {
    color: "#4f46e5",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 24,
  },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: { color: "#dc2626", fontWeight: "600", fontSize: 16 },
});
