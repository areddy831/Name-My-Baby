// src/firebase.js
// ============================================================
// FIREBASE SETUP — Replace the config below with your own!
// See README.md for step-by-step instructions.
// ============================================================
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================================
// Storage API — drop-in replacement for window.storage
// All reads/writes go to Firebase Realtime Database
// ============================================================

export async function fbGet(key) {
  const snapshot = await get(ref(db, `namemybaby/${key}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

export async function fbSet(key, value) {
  await set(ref(db, `namemybaby/${key}`), value);
}

export async function fbRemove(key) {
  await remove(ref(db, `namemybaby/${key}`));
}

// Real-time listener — calls callback whenever data changes
export function fbListen(key, callback) {
  const unsubscribe = onValue(ref(db, `namemybaby/${key}`), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return unsubscribe;
}
