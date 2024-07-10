require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY);
const { ethers } = require("ethers");
const MyNFT = require("./artifacts/purchase/contracts/MyNFT.sol/MyNFT.json");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use(express.static('public'));

const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/fZ-HHD0oPbeUz9lNko4cViCJDIxYbiuh');
const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider);
const contractAddress = "0x2BA98b8399be58FAa918C07cBCBA3d1A6e6111D6";
const contract = new ethers.Contract(contractAddress, MyNFT.abi, wallet);

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const ethPriceInUsd = 3000;
    const nftPriceInUsd = 0.001 * ethPriceInUsd;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Purchase NFT',
            },
            unit_amount: Math.round(nftPriceInUsd * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:4242/confirm-payment`,
      cancel_url: `http://localhost:3000/signin`,
      metadata: { walletAddress }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
});

app.get('/confirm-payment', async (req, res) => {
  const { session_id } = req.query;
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const walletAddress = session.metadata.walletAddress;

    if (session.payment_status === 'paid') {
      const web3Provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/fZ-HHD0oPbeUz9lNko4cViCJDIxYbiuh');
      const userSigner = web3Provider.getSigner(walletAddress);
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, userSigner);

      const tx = await contract.mint({ from: walletAddress });
      await tx.wait();
      console.log('NFT minted:', tx);

      res.redirect(`http://localhost:3000/success?txHash=${tx.hash}&walletAddress=${walletAddress}`);
    } else {
      res.redirect('http://localhost:3000/failure');
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

app.listen(4242, () => console.log('Running on port 4242'));
