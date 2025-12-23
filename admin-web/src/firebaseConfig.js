import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9Lpotul8TKLKK4uu9X4zv1zl6FBl-uo0",

  authDomain: "classmate-stcet.firebaseapp.com",

  projectId: "classmate-stcet",

  storageBucket: "classmate-stcet.firebasestorage.app",

  messagingSenderId: "101140616742",

  appId: "1:101140616742:web:cdf3d18b13ad93e1a838e7",

  measurementId: "G-RFT3F9RMEQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
