import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const MOCK_CHATS = [
  {
    id: 1,
    user: "Rahul (CR)",
    msg: "Guys, teacher is absent today!",
    time: "10:00 AM",
    isMe: false,
  },
  {
    id: 2,
    user: "Sneha",
    msg: "Can someone send the notes for Unit 3?",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: 3,
    user: "You",
    msg: "I will send them in the evening.",
    time: "10:20 AM",
    isMe: true,
  },
];

export default function CommunityScreen({ navigation }) {
  const [userYear, setUserYear] = useState("General");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserYear = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserYear(docSnap.data().year);
        }
      }
      setLoading(false);
    };
    fetchUserYear();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color="#4f46e5" />
          ) : (
            <>
              <Text style={styles.headerTitle}>{userYear} Community</Text>
              <Text style={styles.onlineStatus}>● 24 Online</Text>
            </>
          )}
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {MOCK_CHATS.map((chat) => (
          <View
            key={chat.id}
            style={[
              styles.msgRow,
              chat.isMe ? styles.myMsgRow : styles.otherMsgRow,
            ]}
          >
            {!chat.isMe && <Text style={styles.userName}>{chat.user}</Text>}
            <View
              style={[
                styles.bubble,
                chat.isMe ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  chat.isMe ? styles.myMsgText : styles.otherMsgText,
                ]}
              >
                {chat.msg}
              </Text>
            </View>
            <Text style={styles.timeText}>{chat.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color="#64748b" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
  backBtn: { marginRight: 16 },
  moreBtn: { marginLeft: "auto" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  onlineStatus: { fontSize: 12, color: "#16a34a", fontWeight: "bold" },

  chatList: { flex: 1, padding: 16, backgroundColor: "#f0f4f8" },
  msgRow: { marginBottom: 16, maxWidth: "80%" },
  otherMsgRow: { alignSelf: "flex-start" },
  myMsgRow: { alignSelf: "flex-end", alignItems: "flex-end" },
  userName: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: "600",
  },

  bubble: { padding: 12, borderRadius: 16 },
  otherBubble: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  myBubble: { backgroundColor: "#4f46e5", borderTopRightRadius: 0 },

  msgText: { fontSize: 15, lineHeight: 20 },
  otherMsgText: { color: "#1e293b" },
  myMsgText: { color: "#fff" },
  timeText: { fontSize: 10, color: "#94a3b8", marginTop: 4, marginLeft: 4 },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  attachBtn: { padding: 10 },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#4f46e5",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
