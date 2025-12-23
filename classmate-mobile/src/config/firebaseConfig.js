import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
