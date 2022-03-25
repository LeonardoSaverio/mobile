// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkLjM2PU746J5AjNQzj8y70fFv68vEqhE",
  authDomain: "cedar-carving-249203.firebaseapp.com",
  projectId: "cedar-carving-249203",
  storageBucket: "cedar-carving-249203.appspot.com",
  messagingSenderId: "141539513178",
  appId: "1:141539513178:web:8c123342438fed363d9963",
  measurementId: "G-4JTBNEJ3QZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

