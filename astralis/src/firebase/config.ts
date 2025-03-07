// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmKjq_ObeLmICbOXtrjGf-h6UoBW2h2xo",
  authDomain: "astralis-6811b.firebaseapp.com",
  projectId: "astralis-6811b",
  storageBucket: "astralis-6811b.firebasestorage.app",
  messagingSenderId: "816407078412",
  appId: "1:816407078412:web:01eed7956f3bc481acf029",
  measurementId: "G-72Y624V1RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;