const functions = require('firebase-functions');
const axios = require('axios');

exports.calculateTax = functions.https.onRequest(async (req, res) => {
  try {
    const { postal_code, country } = req.body.customer_details.address;
    const apiKey = functions.config().taxjar.api_key;

    const response = await axios.get(`https://api.taxjar.com/v2/rates/${postal_code}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const rate = response.data.rate.combined_rate * 100;
    res.json({ taxRate: rate });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calculating tax');
  }
});
