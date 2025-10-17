// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAopSGKcT9aXSfVoG7sJCV-qsIhedC-WrU",
  authDomain: "geonotes-6fa35.firebaseapp.com",
  projectId: "geonotes-6fa35",
  storageBucket: "geonotes-6fa35.firebasestorage.app",
  messagingSenderId: "1026641029329",
  appId: "1:1026641029329:web:30e44b1c7db5836d9e3df0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
