// src/firebase/firebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import 'firebase/compat/auth';  // Add this line for compat layer

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
console.log("Firebase initialized:", app.name);

const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = '9D05715E-AB57-4B23-B446-95A239E1843D';
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LdIce0pAAAAAGDioZCkFwa9jYAmP7le4bweWaYq'),
    isTokenAutoRefreshEnabled: true,
  });
}

export { auth, db };
