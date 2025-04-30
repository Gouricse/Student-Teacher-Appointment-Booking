# 📚 Student-Teacher Appointment Booking System

A complete appointment management system that allows students to book appointments with teachers, and teachers to approve or reject them. The system also features admin-level controls to manage user access.

---

## 🔧 Features

### 👨‍🎓 Student Module:
- Register & login
- Search for teachers
- Book appointments
- View approved/rejected appointments
- Send messages to teachers

### 👩‍🏫 Teacher Module:
- Login
- View & manage appointments
- Approve or reject bookings
- View student messages

### 🛠️ Admin Module:
- Login
- Add/update/delete teacher profiles
- Approve or reject student registrations
- Manage system data

---

## 🚀 Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Authentication, Firestore Database
- **Hosting**: Firebase Hosting
- **PDF Generation**: HTML to PDF print
- **Email**: (optional) Firebase Cloud Functions or client-side email libraries

---

## 🔒 Firebase Services Used

- 🔐 Firebase Authentication
- 🧠 Firebase Firestore
- 💾 Firebase Storage (optional, for storing PDF bills)
- 🌐 Firebase Hosting

---

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Gouricse/Student-Teacher-Appointment-Booking.git
cd Student-Teacher-Appointment-Booking

npm install -g firebase-tools
// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase login
firebase init
firebase deploy



