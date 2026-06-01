// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyCxS-t_3tj09BUMgIYcZowgwt9eNxkAbN8",
  authDomain:        "smart-admission-ai.firebaseapp.com",
  projectId:         "smart-admission-ai",
  storageBucket:     "smart-admission-ai.firebasestorage.app",
  messagingSenderId: "703380226967",
  appId:             "1:703380226967:web:89082b7187ad57cceabad2",
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
