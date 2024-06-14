import axios from 'axios';
import Web3 from 'web3';
import { Magic } from 'magic-sdk';

let currentUser = null; // Variable to store the current user

const authenticateWithMetaMask = async () => {
  try {
    // Request user connection to MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const ethAddress = accounts[0];

      // Fetch balance using Web3
      const balance = await web3.eth.getBalance(ethAddress);
      const ethBalance = Web3.utils.fromWei(balance, 'ether');

      // Set currentUser details
      currentUser = {
        ethAddress: ethAddress,
        balance: ethBalance,
      };

      console.log('User authenticated with MetaMask:', currentUser);
      return currentUser;
    } else {
      throw new Error('MetaMask is not installed.');
    }
  } catch (error) {
    console.error('Error during MetaMask authentication:', error);
    throw error;
  }
};

const authenticateWithMagic = async (didToken) => {
  try {
    const response = await axios.post('/api/verify-magic-token', { didToken });
    const { user, token } = response.data;

    if (!user || !token) {
      throw new Error('Failed to verify Magic token');
    }

    // Initialize Web3 with Magic provider
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
    const web3 = new Web3(magic.rpcProvider);

    // Get the user's Ethereum address
    const accounts = await web3.eth.getAccounts();
    const ethAddress = accounts[0];

    // Fetch the user's balance
    const balanceResponse = await axios.get(`https://deep-index.moralis.io/api/v2/${ethAddress}/balance?chain=eth`, {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    });

    const balance = Web3.utils.fromWei(balanceResponse.data.balance, 'ether');

    // Manually set the current user
    currentUser = {
      email: user.email,
      ethAddress: ethAddress,
      sessionToken: token,
      balance: balance, // Add the balance to the currentUser object
    };

    console.log('User authenticated with MagicLink:', currentUser);
    return currentUser;
  } catch (error) {
    console.error('Error during Magic authentication:', error);
    throw error;
  }
};

const getCurrentUser = () => {
  return currentUser;
};

export { authenticateWithMetaMask, authenticateWithMagic, getCurrentUser };