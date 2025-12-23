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
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const DEPARTMENTS = ["CSE", "IT", "AI&ML", "ECE", "EE"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [dept, setDept] = useState("");
  const [loading, setLoading] = useState(false);

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !year || !dept) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        year: year,
        dept: dept,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("MainApp");
    } catch (error) {
      setLoading(false);
      Alert.alert("Registration Failed", error.message);
    }
  };

  const SelectionModal = ({ visible, data, onClose, onSelect, title }) => (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join ClassMate to manage your academic life.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>College Email</Text>
            <TextInput
              style={styles.input}
              placeholder="student@stcet.ac.in"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Year & Dept Selection (Side by Side) */}
          <View style={styles.row}>
            {/* Year Selector */}
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Year</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowYearPicker(true)}
              >
                <Text style={year ? styles.inputText : styles.placeholderText}>
                  {year || "Select Year"}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Dept Selector */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Department</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDeptPicker(true)}
              >
                <Text style={dept ? styles.inputText : styles.placeholderText}>
                  {dept || "Select Dept"}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.boldText}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modals for Selection */}
        <SelectionModal
          visible={showYearPicker}
          data={YEARS}
          title="Select Year"
          onClose={() => setShowYearPicker(false)}
          onSelect={setYear}
        />
        <SelectionModal
          visible={showDeptPicker}
          data={DEPARTMENTS}
          title="Select Department"
          onClose={() => setShowDeptPicker(false)}
          onSelect={setDept}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: "center" },
  header: { marginBottom: 32 },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#64748b" },
  form: { width: "100%" },
  inputGroup: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 14, fontWeight: "600", color: "#334155", marginBottom: 6 },

  // Standard Input
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#0f172a",
  },

  // Custom Dropdown Styles
  dropdown: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontSize: 16, color: "#0f172a" },
  placeholderText: { fontSize: 16, color: "#94a3b8" },
  chevron: { fontSize: 12, color: "#94a3b8" },

  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginLink: { marginTop: 24, alignItems: "center" },
  loginText: { color: "#64748b", fontSize: 15 },
  boldText: { color: "#2563eb", fontWeight: "bold" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1e293b",
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalItemText: { fontSize: 16, color: "#334155", textAlign: "center" },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { color: "#64748b", fontWeight: "bold" },
});
