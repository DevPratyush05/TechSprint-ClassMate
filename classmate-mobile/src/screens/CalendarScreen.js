import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");

  const fetchCalendarData = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    const newMarked = {};
    const allEvents = [];

    try {
      // 1. Fetch Public Notices
      const noticesSnap = await getDocs(collection(db, "notices"));
      noticesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.date) {
          allEvents.push({ id: doc.id, ...data, isPersonal: false });

          let dotColor = "#3b82f6";
          if (data.type === "EXAM") dotColor = "#ef4444";
          if (data.type === "HOLIDAY") dotColor = "#22c55e";

          newMarked[data.date] = { marked: true, dotColor: dotColor };
        }
      });

      // 2. Fetch Personal Events
      const personalRef = collection(
        db,
        `users/${auth.currentUser.uid}/personal_events`
      );
      const personalSnap = await getDocs(personalRef);
      personalSnap.forEach((doc) => {
        const data = doc.data();
        if (data.date) {
          allEvents.push({ id: doc.id, ...data, isPersonal: true });
          if (!newMarked[data.date]) {
            newMarked[data.date] = { marked: true, dotColor: "#a855f7" };
          }
        }
      });

      setEvents(allEvents);
      setMarkedDates(newMarked);
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await addDoc(
        collection(db, `users/${auth.currentUser.uid}/personal_events`),
        {
          title: newTask,
          date: selectedDate,
          type: "PERSONAL",
          createdAt: new Date().toISOString(),
        }
      );
      setNewTask("");
      setModalVisible(false);
      fetchCalendarData();
    } catch (error) {
      Alert.alert("Error", "Could not save task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(
              doc(db, `users/${auth.currentUser.uid}/personal_events`, taskId)
            );
            fetchCalendarData();
          } catch (e) {
            Alert.alert("Error", "Could not delete task.");
          }
        },
      },
    ]);
  };

  const filteredEvents = events.filter((e) => e.date === selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity onPress={fetchCalendarData}>
          <Ionicons name="refresh" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: "#4f46e5",
            selectedTextColor: "#ffffff",
          },
        }}
        theme={{ todayTextColor: "#4f46e5", arrowColor: "#4f46e5" }}
        style={styles.calendar}
      />

      <View style={styles.eventList}>
        <View style={styles.listHeader}>
          <Text style={styles.dateTitle}>Events for {selectedDate}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        {filteredEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events for this day.</Text>
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  item.isPersonal ? styles.personalCard : styles.publicCard,
                ]}
              >
                <View
                  style={[
                    styles.strip,
                    {
                      backgroundColor:
                        item.type === "EXAM"
                          ? "#ef4444"
                          : item.isPersonal
                          ? "#a855f7"
                          : "#22c55e",
                    },
                  ]}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardType}>
                    {item.isPersonal ? "Personal Task" : "College Notice"}
                  </Text>
                </View>
                {/* Delete Button (Only for Personal Tasks) */}
                {item.isPersonal && (
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Submit Assignment"
              value={newTask}
              onChangeText={setNewTask}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTask} style={styles.saveBtn}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  calendar: { borderRadius: 12, margin: 10, elevation: 2 },
  eventList: { flex: 1, padding: 20 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateTitle: { fontWeight: "600", color: "#334155" },
  addBtn: { backgroundColor: "#e0e7ff", padding: 6, borderRadius: 6 },
  addBtnText: { color: "#4338ca", fontWeight: "bold", fontSize: 12 },
  emptyText: { textAlign: "center", color: "#94a3b8", marginTop: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  personalCard: { borderLeftWidth: 0 },
  strip: { width: 4, height: "100%" },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardType: { fontSize: 12, color: "#64748b" },
  deleteBtn: { padding: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  input: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { padding: 10 },
  saveBtn: { backgroundColor: "#4f46e5", padding: 10, borderRadius: 8 },
});
