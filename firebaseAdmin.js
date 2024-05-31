const admin = require('firebase-admin');
const serviceAccount = require('serviceAccountKey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://phantafield-424104.firebaseio.com"
  });

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
