import axios from 'axios';
import Web3 from 'web3';

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

export const authenticateWithMoralis = async (provider) => {
  try {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    // Request message from Moralis
    const messageResponse = await axios.post('https://deep-index.moralis.io/api/v2/auth/requestMessage', {
      address,
      chain: 'eth',
      networkType: 'evm',
    }, {
      headers: {
        'X-API-Key': MORALIS_API_KEY,
      },
    });

    const { message } = messageResponse.data;

    // Sign the message
    const signature = await web3.eth.personal.sign(message, address);

    // Verify the signature with Moralis API
    const verifyResponse = await axios.post('https://deep-index.moralis.io/api/v2/auth/verify', {
      message,
      signature,
    }, {
      headers: {
        'X-API-Key': MORALIS_API_KEY,
      },
    });

    if (verifyResponse.data.success) {
      return { address, signature, token: verifyResponse.data.token };
    } else {
      throw new Error('Moralis authentication failed');
    }
  } catch (error) {
    console.error('Error authenticating with Moralis:', error);
    throw error;
  }
};
