require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);
// Removed ethers and contract-related imports and code

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/create-checkout-session', async (req, res) => {
  const { walletAddress, usdAmount } = req.body;
  localStorage.setItem('walletAddress', walletAddress);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Purchase NFT',
          },
          unit_amount: Math.round(usdAmount * 100), // USD to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/failure`,
      metadata: { walletAddress }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
