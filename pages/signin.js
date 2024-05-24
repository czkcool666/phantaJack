import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useMoralis } from 'react-moralis';
import Web3 from 'web3';
import magic from '../magic';

const SignIn = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_requestAccounts' }).catch((error) => {
          console.error('MetaMask RPC Error:', error);
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('No Ethereum browser detected. Check out MetaMask!');
      }
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

  const handleAuth = async () => {
    console.log('Authenticate Clicked');
    try {
      if (typeof window !== 'undefined' && window.web3 && magic) {
        const web3 = new Web3(window.ethereum);
        console.log('Web3 Instance:', web3);

        const accounts = await web3.eth.requestAccounts();
        console.log('Accounts:', accounts);

        const address = accounts[0];
        console.log('Account Address:', address);

        const { requestChallengeAsync } = useMoralis();
        console.log('Requesting challenge...');

        const { message } = await requestChallengeAsync({
          address,
          chainId: '0x1',
        });
        console.log('Challenge Message:', message);

        console.log('Signing message...');
        const signature = await web3.eth.personal.sign(message, address);
        console.log('Signature:', signature);

        console.log('Signing in...');
        const { url } = await signIn('credentials', {
          message,
          signature,
          redirect: false,
          callbackUrl: '/user',
        });

        console.log('SignIn URL:', url);
        push(url);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <h1 className="text-6xl font-bold mb-8 text-white font-Lobster">PhantaField</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        Login with Google
      </button>
    </div>
  );
};

export default SignIn;
