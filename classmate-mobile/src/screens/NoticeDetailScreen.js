import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoticeDetailScreen({ route, navigation }) {
  const { notice } = route.params;

  const handleSummarize = () => {
    Alert.alert(
      "✨ AI Summary",
      "Coming soon! This feature will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Meta Data */}
        <View style={styles.metaRow}>
          <View
            style={[styles.tag, { backgroundColor: notice.color || "#e0e7ff" }]}
          >
            <Text
              style={[styles.tagText, { color: notice.textColor || "#4338ca" }]}
            >
              {notice.type}
            </Text>
          </View>
          <Text style={styles.date}>{notice.date}</Text>
        </View>

        {/* Notice Content */}
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.body}>{notice.desc}</Text>

        {/* Placeholder Summary Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>✨ AI Summary</Text>
          <Text style={styles.summaryText}>
            This feature will summarize long notices into short bullet points.
            Coming soon.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.aiButton} onPress={handleSummarize}>
          <Text style={styles.aiIcon}>✨</Text>
          <Text style={styles.aiText}>Summarize with AI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  backText: {
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "600",
  },

  content: {
    padding: 24,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },

  tagText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  date: {
    color: "#94a3b8",
    fontSize: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },

  body: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 26,
  },

  summaryBox: {
    marginTop: 24,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#475569",
  },

  summaryText: {
    color: "#64748b",
    lineHeight: 22,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fff",
  },

  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e7ff",
    padding: 16,
    borderRadius: 12,
  },

  aiIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  aiText: {
    color: "#4338ca",
    fontSize: 16,
    fontWeight: "bold",
  },
});
