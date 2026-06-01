// src/firebase/firebaseService.js
// ─────────────────────────────────────────────────────
// All Firebase Auth + Firestore operations in one place
// ─────────────────────────────────────────────────────

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, getDocs,
  query, where, orderBy, limit,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './config';

// ── AUTH ─────────────────────────────────────────────

// Signup — creates Firebase Auth user + Firestore profile
export async function signupUser({ name, email, password, stream, phone }) {
  // 1. Create auth user
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid  = cred.user.uid;

  // 2. Update display name
  await updateProfile(cred.user, { displayName: name });

  // 3. Save profile to Firestore
  await setDoc(doc(db, 'users', uid), {
    uid,
    name,
    email,
    phone:     phone || '',
    stream:    stream || 'Science (PCM)',
    is_admin:  false,
    createdAt: serverTimestamp(),
    academics: {
      p10: 0, p12: 0, cgpa: 0,
      entrance_score: 0,
      entrance_exam:  'JEE Main',
      category: 'General',
      branch:   'Computer Science (CSE)',
      state:    'Delhi',
      extra:    'None',
    },
  });

  return cred.user;
}

// Login
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
}

// Auth state listener
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── USER PROFILE ─────────────────────────────────────

// Get full user profile from Firestore
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update user profile + academics
export async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Update only academic profile
export async function updateAcademics(uid, academics) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, {
    academics,
    updatedAt: serverTimestamp(),
  });
}

// ── PREDICTIONS ──────────────────────────────────────

// Save a prediction result
export async function savePrediction(uid, predictionData) {
  const ref = collection(db, 'predictions');
  const docRef = await addDoc(ref, {
    uid,
    ...predictionData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Get prediction history for a user
export async function getPredictionHistory(uid, maxResults = 10) {
  const q = query(
    collection(db, 'predictions'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── COLLEGES ─────────────────────────────────────────

// Seed colleges to Firestore (run once)
export async function seedColleges(colleges) {
  for (const college of colleges) {
    await setDoc(doc(db, 'colleges', String(college.id)), {
      ...college,
      createdAt: serverTimestamp(),
    });
  }
  console.log(`✅ Seeded ${colleges.length} colleges to Firestore`);
}

// Get all colleges
export async function getColleges() {
  const snap = await getDocs(collection(db, 'colleges'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── SHORTLIST ─────────────────────────────────────────

// Add college to student shortlist
export async function shortlistCollege(uid, college) {
  const ref = collection(db, 'shortlists');
  await addDoc(ref, {
    uid,
    college,
    addedAt: serverTimestamp(),
  });
}

// Get user shortlist
export async function getShortlist(uid) {
  const q = query(collection(db, 'shortlists'), where('uid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── ADMIN ─────────────────────────────────────────────

// Get all users (admin only)
export async function getAllUsers(maxResults = 50) {
  const q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Get total prediction count
export async function getTotalPredictions() {
  const snap = await getDocs(collection(db, 'predictions'));
  return snap.size;
}
