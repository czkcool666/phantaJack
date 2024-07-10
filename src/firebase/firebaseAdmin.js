// src/firebase/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://phantafield-424104.firebaseio.com"
  });
}

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
