// src/moralisInit.js

import Moralis from 'moralis';

let moralisInitialized = false;

const initializeMoralis = async () => {
  if (!moralisInitialized) {
    try {
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

export { initializeMoralis };
