import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, child, query, orderByChild, equalTo } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };

// Realtime Database functions

export const generateReferralCode = (name) => {
  const cleanName = name.toUpperCase().replace(/\s+/g, '').substring(0, 5);
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${cleanName}${year}${randomNum}`;
};

export const checkEmailExists = async (email) => {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some(user => user.email === email);
  }
  return false;
};

export const checkUniqueCodeExists = async (code) => {
  const codesRef = ref(db, 'users');
  const snapshot = await get(codesRef);
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some(user => user.uniqueCode === code);
  }
  return false;
};

export const saveUserToDatabase = async (userData) => {
  try {
    const usersRef = ref(db, 'users');
    const newUserRef = push(usersRef);
    await set(newUserRef, userData);
    return newUserRef.key;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const addValidUniqueCode = async (code, deviceInfo) => {
  try {
    const validCodesRef = ref(db, 'validCodes');
    const newCodeRef = push(validCodesRef);
    await set(newCodeRef, {
      code,
      deviceInfo,
      createdAt: new Date().toISOString(),
      isActive: true
    });
    return newCodeRef.key;
  } catch (error) {
    console.error('Error adding valid code:', error);
    throw error;
  }
};

export const isValidUniqueCode = async (code) => {
  const validCodesRef = ref(db, 'validCodes');
  const snapshot = await get(validCodesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data).some(item => item.code === code && item.isActive);
  }
  return false;
};