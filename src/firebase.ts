import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBLuAW8gB2sThjW89iZIO_19NVhzOfbKzo",
  authDomain: "vue-pizza-fb041.firebaseapp.com",
  databaseURL: "https://vue-pizza-fb041-default-rtdb.firebaseio.com",
  projectId: "vue-pizza-fb041",
  storageBucket: "vue-pizza-fb041.firebasestorage.app",
  messagingSenderId: "757986296009",
  appId: "1:757986296009:web:98e27fc3331b9dfe7d8d18",
  measurementId: "G-6EZR5KL3S4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
