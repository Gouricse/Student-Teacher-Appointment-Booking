import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  collection, getDocs, doc, updateDoc, getDoc, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ✅ Auth Check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You are not logged in!");
    window.location.href = "index.html";
    return;
  }

  loadAppointments(user.uid);
  loadMessages(user.uid);
});

async function getUserNameById(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().name : "Unknown";
  } catch {
    return "Unknown";
  }
}

async function loadAppointments(teacherId) {
  const appointmentsList = document.getElementById("appointmentsList");
  appointmentsList.innerHTML = "";

  const snapshot = await getDocs(query(collection(db, "appointments"), where("teacherId", "==", teacherId)));

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const studentName = await getUserNameById(data.studentId);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Student:</strong> ${studentName} <br>
      <strong>Time:</strong> ${data.time} <br>
      <strong>Message:</strong> ${data.message} <br>
      <strong>Status:</strong> ${data.status} <br>
      <button onclick="updateStatus('${docSnap.id}', 'approved')">Approve</button>
      <button onclick="updateStatus('${docSnap.id}', 'cancelled')">Cancel</button>
    `;
    appointmentsList.appendChild(li);
  }
}

window.updateStatus = async function (id, status) {
  try {
    await updateDoc(doc(db, "appointments", id), { status });
    alert(`Appointment ${status}`);
    location.reload();
  } catch (error) {
    alert("Error updating status: " + error.message);
  }
};

async function loadMessages(teacherId) {
  const messagesList = document.getElementById("messagesList");
  messagesList.innerHTML = "";

  const snapshot = await getDocs(query(collection(db, "messages"), where("to", "==", teacherId)));

  for (const docSnap of snapshot.docs) {
    const msg = docSnap.data();
    const studentName = await getUserNameById(msg.from);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>From:</strong> ${studentName} <br>
      <strong>Message:</strong> ${msg.message} <br>
      <strong>Time:</strong> ${msg.time}
    `;
    messagesList.appendChild(li);
  }
}

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
