// ===============================
// Firebase core
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// Firebase config (YOURS)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyCLHLzJ1wm-j6i7YEf5YfBFGPcE4Qk1gQo",
  authDomain: "math-tutor-student-records.firebaseapp.com",
  projectId: "math-tutor-student-records",
  storageBucket: "math-tutor-student-records.firebasestorage.app",
  messagingSenderId: "759946890002",
  appId: "1:759946890002:web:0fc283523c793c3eeb01cb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// AUTH HELPERS
// ===============================
window.login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// ===============================
// ROLE ROUTING
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) {
    alert("❌ User record missing in Firestore");
    return;
  }

  const role = snap.data().role;

  if (location.pathname.includes("index.html")) {
    window.location.href = "terms.html";
  }

  if (location.pathname.includes("terms.html")) return;

  if (role === "admin" && !location.pathname.includes("admin.html")) {
    window.location.href = "admin.html";
  }

  if (role === "student" && !location.pathname.includes("student.html")) {
    window.location.href = "student.html";
  }
});

// ===============================
// TERMS ACCEPTANCE
// ===============================
window.acceptTerms = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(db, "users", user.uid), {
    termsAccepted: true,
    termsAcceptedAt: serverTimestamp()
  });

  location.reload();
};

// ===============================
// ADMIN FUNCTIONS
// ===============================

// Create student account
window.adminCreateStudent = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    role: "student",
    termsAccepted: false,
    createdAt: serverTimestamp()
  });

  await setDoc(doc(d
