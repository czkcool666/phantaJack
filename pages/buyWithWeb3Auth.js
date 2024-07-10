import axios from 'axios';
import Web3 from "web3";
import { ethers } from "ethers";
import { nftAddress, nftABI } from '../config';
import { initializeWeb3Auth } from '../src/web3authInit';
import { loadStripe } from '@stripe/stripe-js';

let web3auth;
let provider;
let web3authAddress = null;
let web3;

const serverUrl = 'http://localhost:4242'; // Update this to your server URL

export const initWeb3Auth = async () => {
  web3auth = await initializeWeb3Auth();
};

export const loginWithWeb3Auth = async () => {
  if (!web3auth) {
    await initWeb3Auth();
  }
  provider = await web3auth.connect();
  web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();
  console.log('Web3Auth connected account:', accounts[0]);
  web3authAddress = accounts[0];
  localStorage.setItem('walletAddress', accounts[0]);
  localStorage.setItem('loginMethod', "web3auth");

  return web3;
};

export const getEthBalance = async (web3, address) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
};

export const buyWithWeb3Auth = async (nftPrice) => {
  if (!provider) {
    await loginWithWeb3Auth();
  }
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  web3authAddress = accounts[0];

  const balance = await getEthBalance(web3, web3authAddress);

  if (parseFloat(balance) < nftPrice) {
    await buyEthWithStripe();
    return { success: false, message: 'Please complete the ETH purchase and try again.' };
  } else {
    await mintNFTWithETH(nftPrice);
  }
};

const mintNFTWithETH = async (nftPrice) => {
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner(web3authAddress);
  const contract = new ethers.Contract(nftAddress, nftABI, signer);
  
  try {
    const tx = await contract.mint({ value: ethers.utils.parseEther(nftPrice.toString()) });
    console.log('Transaction sent:', tx);

    localStorage.setItem('walletAddress', web3authAddress);
    localStorage.setItem('txHash', tx.hash); // Store transaction hash
    await axios.post(`${serverUrl}/confirm-payment`, { walletAddress: web3authAddress, tx });

    window.location.href = `/success?txHash=${tx.hash}&walletAddress=${web3authAddress}`;

    return { success: true, message: 'Transaction confirmed! You have successfully purchased an NFT.' };
  } catch (error) {
    console.error('Transaction failed:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

export const buyEthWithStripe = async () => {
  try {
    const walletAddress = localStorage.getItem('walletAddress');
    console.log('Sending request to create-checkout-session with wallet address:', walletAddress);

    const response = await axios.post(`${serverUrl}/create-checkout-session`, { walletAddress });
    console.log('Axios response:', response);
    const sessionId = response.data.id;
    const stripe = await loadStripe("pk_test_51PWFIYP2IPixAlzjvAb398QgVwMTjsWLLNEPgWzXu86MENh5Eg0CDrxz4cWn2G3gNPUiJQpyA7LbAXOnbLRa6kWO00o7SW9TqW");

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to Stripe:', error);
      alert('There was an error with the payment. Please try again.');
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    if (error.response) {
      console.error('Axios error details:', error.response.data);
    } else if (error.request) {
      console.error('Axios error details:', error.request);
    } else {
      console.error('Axios error details:', error.message);
    }
    alert('There was an error with the payment. Please try again.');
  }
};

export { web3authAddress, provider };
