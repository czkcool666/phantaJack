// pages/api/verify-magic-token.js
import { Magic } from '@magic-sdk/admin';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const { magic_credential } = req.body;

    // Validate Magic credential
    const didToken = magicAdmin.utils.parseAuthorizationHeader(magic_credential);
    const magicUserMetadata = await magicAdmin.users.getMetadataByToken(didToken);

    // Create custom Firebase token
    const firebaseToken = await admin.auth().createCustomToken(magicUserMetadata.issuer);

    res.status(200).json({ success: true, token: firebaseToken });
  } catch (error) {
    console.error('Error validating Magic credential:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
