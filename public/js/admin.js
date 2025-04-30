import { db, auth } from './firebase-config.js';
import {
  collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// ⚠️ Admin credentials used for re-login
const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";

// ✅ Add Teacher
document.getElementById('addTeacherForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('teacherName').value;
  const email = document.getElementById('teacherEmail').value;
  const password = document.getElementById('teacherPassword').value;
  const department = document.getElementById('teacherDepartment').value;
  const subject = document.getElementById('teacherSubject').value;

  try {
    // Temporarily logout admin
    await signOut(auth);

    // Create teacher in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add teacher data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      department,
      subject,
      role: "teacher",
      approved: true,
      createdAt: new Date()
    });

    alert("Teacher added successfully!");

    // Re-login admin after creating teacher
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    document.getElementById('addTeacherForm').reset();
    loadTeachers();

  } catch (error) {
    console.error("Error adding teacher:", error);
    alert("Failed to add teacher: " + error.message);
    // Re-login admin on error to restore session
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    } catch (err) {
      console.error("Error restoring admin session:", err.message);
    }
  }
});

// ✅ Load Teachers from users collection
async function loadTeachers() {
  const list = document.getElementById('teacherList');
  list.innerHTML = '';

  const q = query(collection(db, "users"), where("role", "==", "teacher"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const teacher = docSnap.data();
    const li = document.createElement('li');
    li.textContent = `${teacher.name} - ${teacher.email}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await deleteDoc(doc(db, "users", docSnap.id));
      loadTeachers();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ✅ Load Pending Students for Approval
async function loadPendingStudents() {
  const list = document.getElementById('pendingStudentList');
  list.innerHTML = '';

  const q = query(collection(db, "users"), where("role", "==", "student"), where("approved", "==", false));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const student = docSnap.data();
    const li = document.createElement('li');
    li.textContent = `${student.name} - ${student.email}`;

    const approveBtn = document.createElement('button');
    approveBtn.textContent = "Approve";
    approveBtn.onclick = async () => {
      try {
        await setDoc(doc(db, "users", docSnap.id), { ...student, approved: true });
        alert(`Approved ${student.name}`);
        loadPendingStudents();
      } catch (err) {
        console.error("Error approving student:", err);
        alert("Failed to approve student: " + err.message);
      }
    };

    const rejectBtn = document.createElement('button');
    rejectBtn.textContent = "Reject";
    rejectBtn.onclick = async () => {
      try {
        await deleteDoc(doc(db, "users", docSnap.id));
        alert(`Rejected ${student.name}`);
        loadPendingStudents();
      } catch (err) {
        console.error("Error rejecting student:", err);
        alert("Failed to reject student: " + err.message);
      }
    };

    li.appendChild(approveBtn);
    li.appendChild(rejectBtn);
    list.appendChild(li);
  });
}

// ✅ LOGOUT HANDLER
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Logout error:", error);
    alert("Error logging out: " + error.message);
  }
});

// ✅ Initial Load
loadTeachers();
loadPendingStudents();
