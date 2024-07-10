import axios from 'axios';
import Web3 from 'web3';
import Moralis from 'moralis';

let currentUser = null; // Variable to store the current user
let moralisInitialized = false;

const initializeMoralis = async () => {
  if (!moralisInitialized) {
    try {
      // Initialize Moralis Web3 API
      Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      });
      moralisInitialized = true;
      console.log('Moralis initialized successfully');
    } catch (error) {
      console.error('Error initializing Moralis:', error);
    }
  } else {
    console.log('Moralis is already initialized');
  }
};

const authenticateWithMetaMask = async () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const ethAddress = accounts[0];

      const balance = await web3.eth.getBalance(ethAddress);
      const ethBalance = Web3.utils.fromWei(balance, 'ether');

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

const authenticateWithWeb3Auth = async (web3auth) => {
  try {
    const provider = await web3auth.connect();
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const balance = await web3.eth.getBalance(address);
    
    const ethBalance = Web3.utils.fromWei(balance, 'ether');

    const moralisUser = {
      ethAddress: address,
      balance: ethBalance,
      username: address,
    };

    currentUser = moralisUser;

    console.log('User authenticated with Web3Auth:', moralisUser);
    return moralisUser;
  } catch (error) {
    console.error('Error during Web3Auth authentication:', error);
    throw error;
  }
};

const getCurrentUser = () => {
  return currentUser;
};

export { initializeMoralis, authenticateWithMetaMask, authenticateWithWeb3Auth, getCurrentUser };
