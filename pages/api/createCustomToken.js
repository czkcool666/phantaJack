import admin from '../../src/firebase/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, ethAddress } = req.body;

    try {
      const customToken = await admin.auth().createCustomToken(uid, { ethAddress });
      res.status(200).send({ token: customToken });
    } catch (error) {
      console.error('Error creating custom token:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).send({ error: 'Error creating custom token', message: error.message });
    }
  } else {
    res.status(405).send({ message: 'Only POST requests are allowed' });
  }
}
