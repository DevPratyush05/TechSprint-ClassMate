import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // 1. Fetch User Data First
  const fetchUserData = async () => {
    if (!auth.currentUser) return null;
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return null;
  };

  // 2. Fetch and Filter Notices
  const fetchNotices = async () => {
    let currentUser = userData;
    if (!currentUser) {
      currentUser = await fetchUserData();
    }

    try {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedNotices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // --- FILTERING LOGIC ---
        // 1. Department Check
        const userDept = currentUser?.dept || "";
        const noticeDept = data.department || "All";
        const isDeptMatch = noticeDept === "All" || userDept === noticeDept;

        // 2. Year Check
        const userYear = currentUser?.year || "";
        const noticeYear = data.year || "All";
        const isYearMatch =
          noticeYear === "All" || userYear.includes(noticeYear);

        // Only add if BOTH match
        if (isDeptMatch && isYearMatch) {
          fetchedNotices.push({
            id: doc.id,
            ...data,
            color: getNoticeColor(data.type).bg,
            textColor: getNoticeColor(data.type).text,
          });
        }
      });

      setNotices(fetchedNotices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNotices();
  }, []);

  const getNoticeColor = (type) => {
    const t = type ? type.toUpperCase() : "GENERAL";
    if (t === "EXAM") return { bg: "#fee2e2", text: "#dc2626" };
    if (t === "HOLIDAY") return { bg: "#dcfce7", text: "#16a34a" };
    if (t === "URGENT") return { bg: "#ffedd5", text: "#c2410c" };
    return { bg: "#dbeafe", text: "#2563eb" };
  };

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.type &&
        notice.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>ClassMate</Text>
          <Text style={styles.greeting}>
            {userData ? `${userData.dept} • ${userData.year}` : "Welcome back"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.communityBtn}
          onPress={() => navigation.navigate("Community")}
        >
          <Text style={styles.communityBtnText}>Community</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notices..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
          />
        }
      >
        <Text style={styles.sectionTitle}>Notice Board</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={{ marginTop: 20 }}
          />
        ) : filteredNotices.length === 0 ? (
          <Text style={styles.noResult}>No notices for you yet.</Text>
        ) : (
          filteredNotices.map((notice) => (
            <TouchableOpacity
              key={notice.id}
              style={styles.card}
              onPress={() => navigation.navigate("NoticeDetail", { notice })}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.tag, { backgroundColor: notice.color }]}>
                  <Text style={[styles.tagText, { color: notice.textColor }]}>
                    {notice.type}
                  </Text>
                </View>
                <Text style={styles.dateText}>{notice.date}</Text>
              </View>
              <Text style={styles.cardTitle}>{notice.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {notice.desc}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  greeting: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  communityBtn: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  communityBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16, color: "#0f172a" },
  scrollContent: { paddingBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },
  noResult: { textAlign: "center", color: "#94a3b8", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagText: { fontSize: 11, fontWeight: "700" },
  dateText: { color: "#94a3b8", fontSize: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardDesc: { color: "#64748b", fontSize: 14, lineHeight: 20 },
});
