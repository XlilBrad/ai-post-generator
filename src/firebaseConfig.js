import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyD3cLci1ygL4uNCcn9tvvxwqYQJeuP5_8o",
  authDomain: "appliweb-25b30.firebaseapp.com",
  projectId: "appliweb-25b30",
  storageBucket: "appliweb-25b30.firebasestorage.app",
  messagingSenderId: "602268222871",
  appId: "1:602268222871:web:4b6d897945179037dab0d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;