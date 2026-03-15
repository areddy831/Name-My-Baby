// src/firebase.js
// ============================================================
// FIREBASE SETUP — Replace the config below with your own!
// See README.md for step-by-step instructions.
// ============================================================
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2oyA6Pv1s6fjUeKTRajIO4jOaxj2uX-4",
  authDomain: "name-my-baby-55061.firebaseapp.com",
  databaseURL: "https://name-my-baby-55061-default-rtdb.firebaseio.com",
  projectId: "name-my-baby-55061",
  storageBucket: "name-my-baby-55061.firebasestorage.app",
  messagingSenderId: "266296336757",
  appId: "1:266296336757:web:b54ad98bf65202d378b33c",
  measurementId: "G-YJRDF78QGX",
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
  const unsubscribe = onValue(
    ref(db, `namemybaby/${key}`),
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    },
    (error) => {
      console.error(`Firebase listen error for ${key}:`, error);
    }
  );
  return unsubscribe;
}
