import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseClient'; // Ensure the import path is correct
import axios from 'axios';
import { useRouter } from 'next/router';
import BlinkingText from './BlinkingText';
import { authenticateWithMoralis } from './moralisAdd'; // Ensure the import path is correct
import { useWeb3React } from '@web3-react/core';

const SignIn = ({ magic }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [metaMaskAccount, setMetaMaskAccount] = useState(null);
  const [magicLinkAccount, setMagicLinkAccount] = useState(null);
  const [moralisBalance, setMoralisBalance] = useState(null);
  const [isMetaMaskRequestPending, setMetaMaskRequestPending] = useState(false);
  const [isGoogleLoginPending, setIsGoogleLoginPending] = useState(false);
  const [moralisLoginStatus, setMoralisLoginStatus] = useState('');
  const [isMoralisLoggedIn, setIsMoralisLoggedIn] = useState(false);

  const { library } = useWeb3React();
  const router = useRouter();

  const fetchMoralisWalletInfo = useCallback(async (address) => {
    if (!address) return;

    try {
      setMoralisLoginStatus('Connecting to Moralis...');
      const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/balance`, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        },
      });
      const balance = Web3.utils.fromWei(response.data.balance, 'ether');
      setMoralisBalance(balance);
      setMoralisLoginStatus('Connected to Moralis');
    } catch (error) {
      setMoralisLoginStatus('Failed to connect to Moralis');
      console.error('Error fetching Moralis wallet info:', error);
    }
  }, []);

  useEffect(() => {
    const handleAuthStateChange = async (user) => {
      if (user) {
        setUser(user);
        const data = await getUserData(user.uid);
        setUserData(data);
        if (metaMaskAccount) {
          fetchMoralisWalletInfo(metaMaskAccount);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    };

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const loggedInUser = result.user;
          setUser(loggedInUser);
          await saveUserData(loggedInUser.uid, loggedInUser.displayName, loggedInUser.email);
          const data = await getUserData(loggedInUser.uid);
          setUserData(data);
          if (metaMaskAccount) {
            fetchMoralisWalletInfo(metaMaskAccount);
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    handleRedirectResult();

    return () => unsubscribe();
  }, [metaMaskAccount, fetchMoralisWalletInfo]);

  const saveUserData = async (userId, name, email, address = null) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        username: name,
        email: email,
        address: address,
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const getUserData = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoginPending(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithRedirect(auth, provider);
  };

  const handleMetaMaskLogin = async () => {
    if (isMetaMaskRequestPending) return;

    setMetaMaskRequestPending(true);

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        if (!accounts || accounts.length === 0) throw new Error('No accounts found.');

        const address = accounts[0];
        setMetaMaskAccount(address);

        await setDoc(doc(db, 'metamask-login', address), { address });

        const { token } = await authenticateWithMoralis(window.ethereum);
        const userCredential = await signInWithCustomToken(auth, token);
        setUser(userCredential.user);
        fetchMoralisWalletInfo(address);
      }
    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
    } finally {
      setMetaMaskRequestPending(false);
    }
  };

  const handleMagicLogin = async () => {
    try {
      const accounts = await magic.rpcProvider.request({ method: 'eth_accounts' });
      const address = accounts[0];

      const { token } = await authenticateWithMoralis(magic.rpcProvider);
      const userCredential = await signInWithCustomToken(auth, token);
      setUser(userCredential.user);
      setMagicLinkAccount(address);
      fetchMoralisWalletInfo(address);
    } catch (error) {
      console.error('Error during Magic Link login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setMetaMaskAccount(null);
      setMagicLinkAccount(null);
      setMoralisBalance(null);
      setMoralisLoginStatus('');
      setIsMoralisLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <BlinkingText />
      {!user && !metaMaskAccount && !magicLinkAccount ? (
        <>
          <button
            onClick={handleGoogleLogin}
            className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
            disabled={isGoogleLoginPending}
          >
            {isGoogleLoginPending ? 'Logging in...' : 'Login with Google'}
          </button>
          <button
            onClick={handleMetaMaskLogin}
            className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
            disabled={isMetaMaskRequestPending}
          >
            {isMetaMaskRequestPending ? 'Logging in...' : 'Login with MetaMask'}
          </button>
        </>
      ) : (
        <div className="mt-8 p-4 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold">User Info:</h2>
          {userData && (
            <>
              {userData.email && <p><strong>Email:</strong> {userData.email}</p>}
              {userData.username && <p><strong>Display Name:</strong> {userData.username}</p>}
              {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
            </>
          )}
          {metaMaskAccount && (
            <>
              <p><strong>Account Address:</strong> {metaMaskAccount}</p>
            </>
          )}
          {magicLinkAccount && (
            <>
              <p><strong>Magic Link Account Address:</strong> {magicLinkAccount}</p>
            </>
          )}
          {moralisBalance !== null && (
            <>
              <p><strong>Balance:</strong> {moralisBalance} ETH</p>
            </>
          )}
          <p><strong>Moralis Login Status:</strong> {moralisLoginStatus}</p>
          {isMoralisLoggedIn && <p>Moralis is logged in.</p>}
          {!isMoralisLoggedIn && <p>Moralis is not logged in.</p>}
          <button
            onClick={handleLogout}
            className="common-btn bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4"
          >
            Logout
          </button>
          {!isMoralisLoggedIn && (
            <button
              onClick={handleMagicLogin}
              className="common-btn bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4"
            >
              Connect Moralis with Magic Link
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SignIn;
