import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import axios from 'axios';

const SignIn = ({ magic }) => {
  const { push } = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).catch((error) => {
        console.error('MetaMask RPC Error:', error);
      });
    }
  }, []);

  const handleGoogleLogin = async () => {
    console.log('Google Login Clicked');
    if (magic) {
      console.log('Magic Instance:', magic);
      await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `${window.location.origin}/callback`,
      });
    }
  };

  const handleMetaMaskLogin = async () => {
    console.log('MetaMask Login Clicked');
    try {
      if (typeof window !== 'undefined' && window.web3) {
        const web3 = new Web3(window.ethereum);
        console.log('Web3 Instance:', web3);

        const accounts = await web3.eth.requestAccounts();
        console.log('Accounts:', accounts);

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found.');
        }

        const address = accounts[0];
        console.log('Account Address:', address);

        // Call the API to authenticate with Moralis and store login info to Parse
        const response = await axios.post('/api/auth', { address });
        if (response.data.success) {
          console.log('User authenticated and login info stored:', response.data.data);
        } else {
          console.error('Authentication failed:', response.data.error);
        }
      }
    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <h1 className="text-6xl font-bold mb-8 text-white font-Lobster">PhantaField</h1>
      <button
        onClick={handleGoogleLogin}
        className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
      >
        Login with Google
      </button>
      <button
        onClick={handleMetaMaskLogin}
        className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        Login with MetaMask
      </button>
    </div>
  );
};

export default SignIn;
