// public/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0C0__dqkHV1-HXA4PWtiEt7srsMYdtVY",
  authDomain: "student-teacher-booking-cab8f.firebaseapp.com",
  projectId: "student-teacher-booking-cab8f",
  storageBucket: "student-teacher-booking-cab8f.appspot.com",
  messagingSenderId: "723839852305",
  appId: "1:723839852305:web:5369edec51c9eec76136b0",
  measurementId: "G-11YKSTZWEK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
