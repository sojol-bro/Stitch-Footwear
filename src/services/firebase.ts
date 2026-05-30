import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || '',
  databaseURL: (import.meta.env.VITE_FIREBASE_DATABASE_URL as string) || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || ''
};

// Helper to check if credentials are valid and configured (not placeholder strings)
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes('YOUR_FIREBASE') &&
  firebaseConfig.databaseURL &&
  !firebaseConfig.databaseURL.includes('YOUR_FIREBASE')
);

let dbInstance: ReturnType<typeof getDatabase> | null = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getDatabase(app);
  } catch (error) {
    console.error('Failed to initialize Firebase Realtime Database:', error);
  }
} else {
  console.warn(
    'Firebase Realtime Database credentials are not configured or still contain placeholder values. ' +
    'The application is running in hybrid offline fallback mode (using LocalStorage for persistence).'
  );
}

export const db = dbInstance;
