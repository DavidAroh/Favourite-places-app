// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCk9w_EiijUTXFvBdFEMTKzLvwVjj4alRQ",
  authDomain: "favourite-places-app-cbab0.firebaseapp.com",
  projectId: "favourite-places-app-cbab0",
  storageBucket: "favourite-places-app-cbab0.firebasestorage.app",
  messagingSenderId: "45826140242",
  appId: "1:45826140242:web:76418734f85e8ec954d78b",
  measurementId: "G-3MYBDVL36W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
