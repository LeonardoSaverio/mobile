// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlyvp6vgwHkQhzz0KYgEbZbeHqeiZ1HLA",
  authDomain: "testauth-6afcb.firebaseapp.com",
  projectId: "testauth-6afcb",
  storageBucket: "testauth-6afcb.appspot.com",
  messagingSenderId: "945850583808",
  appId: "1:945850583808:web:e50c1f55a34a7cd8b101e5",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

