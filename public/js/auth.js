import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// 🔹 Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const role = e.target.role.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role,
      approved: role === "student" ? false : true
    });

    alert("Registration successful. Please login.");
    window.location.href = "index.html";
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
});

// 🔹 Login
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector("input[name='role']:checked").value;

  if (role === "admin") {
    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Admin Login Successful");
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Invalid Admin Credentials");
    }
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      alert("User data not found.");
      return;
    }

    const userData = userDoc.data();

    if (userData.role !== role) {
      alert("Role mismatch. Please choose correct role.");
      return;
    }

    if (!userData.approved) {
      alert("Your registration is pending admin approval.");
      return;
    }

    localStorage.setItem("userId", userId);

    if (role === "student") {
      window.location.href = "student-dashboard.html";
    } else if (role === "teacher") {
      window.location.href = "teacher-dashboard.html";
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login Failed: " + error.message);
  }
});
