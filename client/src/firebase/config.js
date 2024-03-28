import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgSEqcIjZDgGxhGqnKg6ICZH1yAO9Rjks",
  authDomain: "pawsitive-7e3ac.firebaseapp.com",
  projectId: "pawsitive-7e3ac",
  storageBucket: "pawsitive-7e3ac.appspot.com",
  messagingSenderId: "301900657265",
  appId: "1:301900657265:web:50de1aeaefe46320cd21d0",
  measurementId: "G-S3GBZG9M5D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log(auth)