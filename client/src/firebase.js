// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-372cc.firebaseapp.com",
  projectId: "mern-auth-372cc",
  storageBucket: "mern-auth-372cc.appspot.com",
  messagingSenderId: "908952793508",
  appId: "1:908952793508:web:84977d55c9960b0788d131",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
