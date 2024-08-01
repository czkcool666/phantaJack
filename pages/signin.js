// pages/signin.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import { initializeWeb3Auth } from '../src/web3authInit'; 
import BlinkingText from './BlinkingText';
import '../styles/background.css';
import { db } from '../src/firebase/firebaseClient'; 
import { doc, setDoc, Timestamp } from 'firebase/firestore'; // Import Timestamp

const SignIn = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { web3auth } = await initializeWeb3Auth();
      const provider = await web3auth.connect();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const user = await web3auth.getUserInfo();

      const userEmail = user.email || 'Email not available';
      const userName = user.name || 'Unnamed User';

      localStorage.setItem('web3authWalletAddress', address);
      localStorage.setItem('web3authUserEmail', userEmail);
      localStorage.setItem('loginMethod', 'web3auth');

      const userDoc = doc(db, 'users', userName); 
      await setDoc(userDoc, { 
        address, 
        email: userEmail, 
        timestamp: Timestamp.now() // Add timestamp field
      });
      console.log(`User data stored in Firestore: Name=${userName}, Address=${address}, Email=${userEmail}, Timestamp=${Timestamp.now()}`);
      router.push('/buyNFT');
    }
    catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <BlinkingText />
        <button
          onClick={handleLogin}
          className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
        >
          Log in with Web3Auth
        </button>
      </div>
    </div>
  );
};

export default SignIn;
