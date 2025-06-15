
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQuzHalYRPfTq_wRic0W90Jc8lRdq_ljw",
  authDomain: "parentalassist-f78a1.firebaseapp.com",
  projectId: "parentalassist-f78a1",
  storageBucket: "parentalassist-f78a1.firebasestorage.app",
  messagingSenderId: "1098131295522",
  appId: "1:1098131295522:web:135dde410936f66ec5297b",
  measurementId: "G-YC7SREM4FH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
