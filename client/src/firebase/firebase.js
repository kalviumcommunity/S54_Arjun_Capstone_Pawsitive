import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLd-6AOqArW29JqFTF9J89Td_KjB1Tju4",
  authDomain: "pawsitive-64728.firebaseapp.com",
  projectId: "pawsitive-64728",
  storageBucket: "pawsitive-64728.appspot.com",
  messagingSenderId: "600850619067",
  appId: "1:600850619067:web:47824d8be2033f2cb2679e",
  measurementId: "G-ZQ4TJX3XM5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();
console.log(auth)