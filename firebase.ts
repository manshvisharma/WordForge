import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaDZjSw6dLW_JUBtakXLoEOa85xv0at38",
  authDomain: "spokenlearning-ba5dc.firebaseapp.com",
  projectId: "spokenlearning-ba5dc",
  storageBucket: "spokenlearning-ba5dc.firebasestorage.app",
  messagingSenderId: "237408625410",
  appId: "1:237408625410:web:0e439f9cc1ed7c2b6d581b",
  measurementId: "G-DY31CV9B60"
};

// Use compat initialization to support compat Auth
const app = firebase.initializeApp(firebaseConfig);

// Use compat Auth instance
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

// Use modular Firestore with the compat app instance
export const db = getFirestore(app);