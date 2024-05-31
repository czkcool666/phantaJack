// server.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./firebaseAdmin');

const app = express();
app.use(bodyParser.json());

app.post('/createCustomToken', async (req, res) => {
  const { uid } = req.body;

  try {
    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
