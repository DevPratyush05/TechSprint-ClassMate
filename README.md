# 🎓 TechSprint ClassMate

> **Smart Classroom Management System** - Built for the TechSprint Hackathon 2025.

ClassMate is a comprehensive solution designed to bridge the gap between students and college administration. It features a dual-interface system: a Web Dashboard for admins to manage schedules and notices, and a Cross-Platform Mobile App for students to view attendance and receive real-time updates.

---

## 🚀 Live Demo & Download (MVP)

**Judges, please find our submission links below:**

- **🌐 Admin Dashboard (Web):** [https://classmate-stcet.web.app](https://classmate-stcet.web.app)
  - *Log in to post notices and manage student data.*
- **📱 Android App (.apk):** [Download from GitHub Releases](https://github.com/DevPratyush05/TechSprint-ClassMate/releases)
  - *Download the latest release to test the student mobile experience.*
- **🎥 Video Demo:** [Link to your YouTube Video]

---

## ✨ Key Features

### 🖥️ Admin Web Portal
- **Dashboard:** At-a-glance view of total students, faculty, and recent activities.
- **Notice Board:** Create and broadcast push notifications to all students instantly.
- **Routine Management:** Dynamic timetable updates that sync to student phones.
- **Attendance Analytics:** Visual graphs showing attendance trends.

### 📱 Student Mobile App
- **Real-time Notifications:** Receive instant alerts for classes and notices.
- **Attendance Tracker:** View individual attendance percentage and history.
- **Digital Routine:** Always updated class schedule.
- **Profile Management:** Student details and academic info.

---

## 🛠️ Tech Stack

### 📱 Mobile App (Student Side)
- **Framework:** React Native (Expo)
- **Navigation:** React Navigation
- **Styling:** StyleSheet & Vector Icons

### 💻 Admin Web (Management Side)
- **Framework:** React.js (Vite)
- **Hosting:** Firebase Hosting
- **Styling:** CSS3 / Styled Components

### ☁️ Backend & Infrastructure
- **Database:** Firebase Firestore (Real-time NoSQL DB)
- **Authentication:** Firebase Auth
- **Build Tool:** EAS (Expo Application Services)

---


## ⚡ How to Run Locally

If you wish to build the project from source:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/DevPratyush05/TechSprint-ClassMate.git](https://github.com/DevPratyush05/TechSprint-ClassMate.git)
   cd TechSprint-ClassMate

2. **Setup Admin Web**
   ```bash
   cd admin-web
   npm install
   npm run dev

3. **Setup Mobile App**
   ```bash
   cd classmate-mobile
   npm install
   npx expo start


**Made with ❤️ by Pratyush & Team PARADOX**
### Final Step after pasting:
After you save this file, run these commands one last time to push the README to GitHub so it appears on your main page:

```bash
git add README.md
git commit -m "Update README with MVP links"
git push origin main
