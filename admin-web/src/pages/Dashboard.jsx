import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    message: "",
    attachment: "",
    department: "All",
    year: "All",
    category: "General",
  });

  const [filterDept, setFilterDept] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notices"), (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedEvents.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setEvents(fetchedEvents);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isoDate = new Date().toISOString().split("T")[0];
      await addDoc(collection(db, "notices"), {
        title: newEvent.title,
        desc: newEvent.message,
        type: newEvent.category.toUpperCase(),
        date: isoDate,
        department: newEvent.department,
        year: newEvent.year,
        attachment: newEvent.attachment,
        createdAt: new Date().toISOString(),
      });
      alert("Notice Posted Successfully!");
      setNewEvent({
        title: "",
        message: "",
        attachment: "",
        department: "All",
        year: "All",
        category: "General",
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error posting notice.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const selectedEvents = events.filter((ev) => ev.selected);
    if (selectedEvents.length === 0) return alert("Select an event first.");

    if (window.confirm(`Delete ${selectedEvents.length} notice(s)?`)) {
      try {
        for (const ev of selectedEvents) {
          await deleteDoc(doc(db, "notices", ev.id));
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleResetPassword = async () => {
    if (auth.currentUser?.email) {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert(`Reset link sent to ${auth.currentUser.email}`);
    }
  };

  const toggleSelect = (id) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, selected: !ev.selected } : ev
      )
    );
  };

  const filteredEvents = events.filter(
    (ev) =>
      (filterDept === "All" || ev.department === filterDept) &&
      (filterYear === "All" || ev.year === filterYear)
  );

  return (
    <div style={styles.page}>
      {/* Navbar - Fixed to full width */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h2 style={styles.logo}>ClassMate Admin</h2>
          <div style={{ position: "relative" }}>
            <button
              style={styles.profileBtn}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              👤 {auth.currentUser?.email?.split("@")[0] || "Admin"}
            </button>

            {showProfileMenu && (
              <div style={styles.dropdown}>
                <button
                  style={styles.dropdownItem}
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
                <div style={styles.divider}></div>
                <button
                  style={{ ...styles.dropdownItem, color: "red" }}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content - Fixed centering */}
      <div style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <h1 style={styles.title}>Notice Dashboard</h1>
            <div style={styles.actions}>
              <button
                style={styles.primaryBtn}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "+ Post New Notice"}
              </button>
              <button style={styles.dangerBtn} onClick={handleDelete}>
                Delete Selected
              </button>
            </div>
          </div>

          {showForm && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Create New Notice</h3>
              <form onSubmit={handlePost} style={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <div style={styles.row}>
                  <select
                    value={newEvent.department}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, department: e.target.value })
                    }
                    style={styles.select}
                  >
                    <option>All</option>
                    <option>CSE</option>
                    <option>IT</option>
                    <option>ECE</option>
                    <option>AI&ML</option>
                  </select>
                  <select
                    value={newEvent.year}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, year: e.target.value })
                    }
                    style={styles.select}
                  >
                    <option>All</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                  </select>
                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, category: e.target.value })
                    }
                    style={styles.select}
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Attachment Link (Optional)"
                  value={newEvent.attachment}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, attachment: e.target.value })
                  }
                  style={styles.input}
                />
                <textarea
                  placeholder="Description"
                  value={newEvent.message}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, message: e.target.value })
                  }
                  style={styles.textarea}
                  required
                />

                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Notice"}
                </button>
              </form>
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Filter View:</span>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                style={styles.filterSelect}
              >
                <option>All Departments</option>
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>AI&ML</option>
              </select>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={styles.filterSelect}
              >
                <option>All Years</option>
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>4th</option>
              </select>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Select</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Target Audience</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} style={styles.tr}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={ev.selected || false}
                        onChange={() => toggleSelect(ev.id)}
                      />
                    </td>
                    <td style={styles.td}>{ev.date}</td>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      {ev.title}
                    </td>
                    <td style={styles.td}>
                      {ev.department} / {ev.year}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: getBadgeColor(ev.type),
                        }}
                      >
                        {ev.type}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {ev.attachment ? (
                        <a
                          href={ev.attachment}
                          target="_blank"
                          style={styles.link}
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <p style={styles.empty}>No notices found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getBadgeColor = (type) => {
  if (type === "EXAM") return "#ef4444";
  if (type === "HOLIDAY") return "#10b981";
  if (type === "URGENT") return "#f97316";
  return "#3b82f6";
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "Segoe UI, sans-serif",
    color: "#1e293b",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    backgroundColor: "#4f46e5",
    padding: "15px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#ffffff",
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
  },
  profileBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  profileBtnHover: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "40px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "8px",
    width: "160px",
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#334155",
    transition: "background-color 0.2s",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "0",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1200px",
    width: "100%",
    padding: "0 20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    fontSize: "28px",
    color: "#1e293b",
    margin: 0,
    fontWeight: "700",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    minWidth: "150px",
  },
  dangerBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    minWidth: "150px",
  },
  submitBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    width: "100%",
    boxSizing: "border-box",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#4f46e5",
    fontSize: "20px",
    fontWeight: "600",
  },
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    width: "100%",
    backgroundColor: "#fff",
    color: "#334155",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    flex: 1,
    minWidth: "150px",
    backgroundColor: "#fff",
    color: "#334155",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    minHeight: "80px",
    width: "100%",
    backgroundColor: "#fff",
    color: "#334155",
    boxSizing: "border-box",
    resize: "vertical",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
  filterLabel: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "14px",
  },
  filterSelect: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    color: "#334155",
    minWidth: "150px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    overflowX: "auto",
    display: "block",
  },
  thead: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "14px 12px",
    color: "#334155",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
    fontSize: "16px",
  },
};

export default Dashboard;
