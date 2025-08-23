import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx9s-ZoiEf_93YmCt24d4hGBesp4rBG7k",
  authDomain: "codequest-f0761.firebaseapp.com",
  projectId: "codequest-f0761",
  storageBucket: "codequest-f0761.firebasestorage.app",
  messagingSenderId: "752233676006",
  appId: "1:752233676006:web:a4133a8175fb3dd88a0f27"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
