s// /pages/api/auth.js
import { auth, db } from '@/firebase/firebaseAdmin';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { address } = req.body;

    try {
      // Create a custom token for the MetaMask user
      const customToken = await auth.createCustomToken(address);

      // Save the user info in Firestore
      await db.collection('users').doc(address).set({ address });

      // Respond with the custom token
      res.status(200).json({ success: true, token: customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
