import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  collection, getDocs, getDoc, doc, addDoc, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const teacherSelect = document.getElementById("teacherSelect");
const messageTeacherSelect = document.getElementById("messageTeacherSelect");
const appointmentsList = document.getElementById("appointmentsList");
const messageList = document.getElementById("messageList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You are not logged in!");
    window.location.href = "index.html";
    return;
  }

  try {
    const teacherQuery = query(collection(db, "users"), where("role", "==", "teacher"));
    const snapshot = await getDocs(teacherQuery);

    teacherSelect.innerHTML = `<option value="" disabled selected>Select Teacher</option>`;
    messageTeacherSelect.innerHTML = `<option value="" disabled selected>Select Teacher</option>`;

    snapshot.forEach(doc => {
      const data = doc.data();
      const option1 = document.createElement("option");
      const option2 = document.createElement("option");

      option1.value = doc.id;
      option1.textContent = `${data.name} - ${data.department} - ${data.subject}`;

      option2.value = doc.id;
      option2.textContent = option1.textContent;

      teacherSelect.appendChild(option1);
      messageTeacherSelect.appendChild(option2);
    });

    await loadAppointments(user.uid);
    await loadMessages(user.uid);
  } catch (error) {
    console.error("Error fetching teachers:", error);
  }
});

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const teacherId = teacherSelect.value;
  const time = document.getElementById("appointmentTime").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "appointments"), {
      studentId: auth.currentUser.uid,
      teacherId,
      time,
      message,
      status: "pending"
    });

    alert("Appointment requested!");
    await loadAppointments(auth.currentUser.uid);
    e.target.reset();
  } catch (error) {
    alert("Failed to book appointment: " + error.message);
  }
});

async function loadAppointments(studentId) {
  appointmentsList.innerHTML = "";
  const snapshot = await getDocs(query(collection(db, "appointments"), where("studentId", "==", studentId)));

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    let teacherName = data.teacherId;

    const teacherDoc = await getDoc(doc(db, "users", data.teacherId));
    if (teacherDoc.exists()) {
      teacherName = teacherDoc.data().name;
    }

    const li = document.createElement("li");
    li.textContent = `Teacher: ${teacherName}, Time: ${data.time}, Status: ${data.status}`;
    appointmentsList.appendChild(li);
  }
}

document.getElementById("messageForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const to = messageTeacherSelect.value;
  const message = document.getElementById("messageText").value;

  try {
    await addDoc(collection(db, "messages"), {
      from: auth.currentUser.uid,
      to,
      message,
      time: new Date().toISOString()
    });

    alert("Message sent!");
    await loadMessages(auth.currentUser.uid);
    e.target.reset();
  } catch (error) {
    alert("Failed to send message: " + error.message);
  }
});

async function loadMessages(studentId) {
  messageList.innerHTML = "";

  const snapshot = await getDocs(query(collection(db, "messages"), where("from", "==", studentId)));

  for (const docSnap of snapshot.docs) {
    const msg = docSnap.data();
    const teacherDoc = await getDoc(doc(db, "users", msg.to));
    const teacherName = teacherDoc.exists() ? teacherDoc.data().name : "Unknown";

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>To:</strong> ${teacherName} <br>
      <strong>Message:</strong> ${msg.message} <br>
      <strong>Time:</strong> ${msg.time}
    `;
    messageList.appendChild(li);
  }
}

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
