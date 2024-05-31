
// firebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyBgEftqqH04eUHnNLpWkTTjHidRY5PIqc0",
  authDomain: "phantafield-424104.firebaseapp.com",
  projectId: "phantafield-424104",
  storageBucket: "phantafield-424104.appspot.com",
  messagingSenderId: "758789077626",
  appId: "1:758789077626:web:336708dfbc700c61ebd9c3",
  measurementId: "G-8QZXHTZ6F9",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
console.log("Firebase initialized:", app.name);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
if (typeof window !== 'undefined') {
  // Use debug token for App Check
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = '9D05715E-AB57-4B23-B446-95A239E1843D';

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true,
  });
}


export { auth, provider, db };
