// Firebase client configuration
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Firebase app instance
export default app;

// Helper function to handle auth errors (similar to Supabase's handleAuthError)
export const handleAuthError = (error) => {
  console.error('Firebase Auth Error:', error);
  if (error.code === 'auth/user-token-expired' || error.code === 'auth/invalid-user-token') {
    // Clear local storage and redirect to login
    localStorage.clear();
    window.location.href = '/auth';
  }
};

// Helper function to get current user (similar to Supabase's getSession)
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Helper function to subscribe to auth state changes (similar to Supabase's onAuthStateChange)
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
