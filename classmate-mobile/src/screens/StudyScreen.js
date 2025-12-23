import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getGeminiResponse } from "../config/gemini";

const SUBJECTS = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS301",
    color: "#e0e7ff",
    icon: "git-network-outline",
  },
  {
    id: 2,
    name: "Algorithms",
    code: "CS302",
    color: "#fee2e2",
    icon: "calculator-outline",
  },
  {
    id: 3,
    name: "Digital Logic",
    code: "CS303",
    color: "#dcfce7",
    icon: "hardware-chip-outline",
  },
  {
    id: 4,
    name: "Mathematics III",
    code: "BS301",
    color: "#fef3c7",
    icon: "analytics-outline",
  },
];

export default function StudyScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Study AI. Ask me anything about your subjects.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const reply = await getGeminiResponse(input);

    const aiMsg = { id: Date.now() + 1, text: reply, sender: "ai" };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Material 📚</Text>
        <Text style={styles.headerSubtitle}>Select a subject or ask AI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Subjects Grid (Same as before) */}
        <View style={styles.grid}>
          {SUBJECTS.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              style={[styles.card, { backgroundColor: sub.color }]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={sub.icon} size={24} color="#334155" />
              </View>
              <Text style={styles.cardTitle}>{sub.name}</Text>
              <Text style={styles.cardCode}>{sub.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="sparkles" size={24} color="#fff" />
        <Text style={styles.fabText}>Ask AI</Text>
      </TouchableOpacity>

      {/* CHAT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Study Assistant 🤖</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.msgBubble,
                  item.sender === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={
                    item.sender === "user" ? styles.userText : styles.aiText
                  }
                >
                  {item.text}
                </Text>
              </View>
            )}
          />

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Ask a question..."
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={sendMessage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  headerSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  content: { padding: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignSelf: "flex-start",
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 12,
  },
  cardCode: { fontSize: 12, color: "#475569", fontWeight: "600" },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6,
  },
  fabText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  closeText: { color: "#ef4444", fontSize: 16, fontWeight: "600" },

  msgBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#4f46e5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: "#f1f5f9",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },
  userText: { color: "#fff" },
  aiText: { color: "#1e293b" },

  inputArea: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#4f46e5",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
