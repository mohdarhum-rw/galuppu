// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFWe3lXcttlvyW0Y5boNtcs5gHmVKXHtI",
  authDomain: "lmaoded-57eda.firebaseapp.com",
  projectId: "lmaoded-57eda",
  storageBucket: "lmaoded-57eda.appspot.com",
  messagingSenderId: "533059939080",
  appId: "1:533059939080:web:0be13e9a9970f0a6fd1abd",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
