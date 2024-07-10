const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 4000;

// Enable all CORS requests
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/calculate-tax', async (req, res) => {
  const { postal_code, country } = req.body.customer_details.address;

  try {
    const response = await axios.get(`https://api.taxjar.com/v2/rates/${postal_code}`, {
      headers: {
        Authorization: `Bearer ${'545e1bf347c27f5b71fbc34a3928daee'}`
      }
    });

    const taxRate = response.data.rate.combined_rate;
    res.json({ taxRate });
  } catch (error) {
    console.error('Error fetching tax rate:', error);
    res.status(500).json({ error: 'Failed to fetch tax rate' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
