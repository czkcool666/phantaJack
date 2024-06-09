import Moralis from 'moralis';
import axios from 'axios';

let isMoralisStarted = false;
let currentUser = null; // Variable to store the current user

const startMoralis = () => {
  if (!isMoralisStarted) {
    Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY, // Ensure this is set in your .env.local file
    });
    isMoralisStarted = true;
    console.log('Moralis started');
  } else {
    console.log('Moralis already started');
  }
};

startMoralis();

const authenticateWithMagic = async (didToken) => {
  try {
    const response = await axios.post('/api/verify-magic-token', { didToken });
    const { user, token } = response.data;

    if (!user || !token) {
      throw new Error('Failed to verify Magic token');
    }

    // Simulate setting up the user in Moralis
    currentUser = new Moralis.User();
    currentUser.set('username', user.email);
    currentUser.set('email', user.email);
    currentUser.set('sessionToken', token); // Set the session token if needed

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

export { authenticateWithMagic, getCurrentUser };
export default Moralis;
