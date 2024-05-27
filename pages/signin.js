import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import Moralis from 'moralis';

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

        // Initialize Moralis
        Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });

        // Request challenge from Moralis
        const { message } = await Moralis.Auth.requestMessage({
          address,
          chain: '0x1', // Mainnet
          networkType: 'evm',
        });

        console.log('Challenge Message:', message);

        // Sign the message
        const signature = await web3.eth.personal.sign(message, address);
        console.log('Signature:', signature);

        if (!signature) {
          throw new Error('No signature obtained.');
        }

        // Authenticate the user with the signed message
        const authData = { message, signature };
        const user = await Moralis.Auth.verify(authData, 'evm');
        console.log('Authenticated user:', user);

        // Sign in with NextAuth.js
        const signInResponse = await signIn('credentials', {
          message,
          signature,
          redirect: false,
          callbackUrl: '/user',
        });

        console.log('signIn Response:', signInResponse);

        if (signInResponse.error) {
          console.error('Error during sign-in:', signInResponse.error);
        } else if (signInResponse.url) {
          push(signInResponse.url);
        } else {
          console.error('Unexpected signIn response structure:', signInResponse);
        }
      }
    } catch (error) {
      console.error('Error during MetaMask authentication:', error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <h1 className="text-6xl font-bold mb-8 text-white font-Lobster">PhantaField</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
      >
        Login with Google
      </button>
      <button
        onClick={handleMetaMaskLogin}
        className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        Login with MetaMask
      </button>
    </div>
  );
};

export default SignIn;
