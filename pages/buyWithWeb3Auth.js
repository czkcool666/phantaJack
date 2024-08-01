import axios from 'axios';
import Web3 from "web3";
import { ethers } from "ethers";
import { initializeWeb3Auth } from '../src/web3authInit';
import { loadStripe } from '@stripe/stripe-js';
import { nftAddress, nftABI } from '../config';

let web3auth;
let provider;
let web3authAddress = null;

const serverUrl = 'http://localhost:4242'; // Update this to your server URL

export const buyWithWeb3Auth = async (usdAmount) => {
  try {
    // Retrieve wallet address from local storage
    const walletAddress = localStorage.getItem('web3authWalletAddress');

    // Create Stripe checkout session
    const response = await axios.post(`${serverUrl}/create-checkout-session`, { walletAddress, usdAmount });
    const sessionId = response.data.id;

    // Load Stripe and redirect to checkout
    const stripe = await loadStripe("pk_test_51PWFIYP2IPixAlzjvAb398QgVwMTjsWLLNEPgWzXu86MENh5Eg0CDrxz4cWn2G3gNPUiJQpyA7LbAXOnbLRa6kWO00o7SW9TqW");
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to Stripe:', error);
      return { success: false, message: 'There was an error with the payment. Please try again.' };
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return { success: false, message: 'There was an error with the payment. Please try again.' };
  }
};

const mintNFTWithStripe = async (nftPrice) => {
  try {

    const { web3auth  } = await initializeWeb3Auth();
    const provider = await web3auth.connect();
 
    if (!provider) throw new Error("Provider initialization failed");

    // Connect to Ethereum provider and contract
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(nftAddress, nftABI, signer);

    // Mint NFT and wait for transaction confirmation
    const tx = await contract.simulateMint();
    await tx.wait();

    console.log('NFT has been sent successfully', tx);

    // Store transaction and wallet address in local storage
    localStorage.setItem('txHash', tx.hash);
    return { success: true, message: 'Transaction confirmed! You have successfully purchased an NFT.' };
  } catch (error) {
    console.error('NFT failed to be sent', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

export { web3authAddress, provider, mintNFTWithStripe };
