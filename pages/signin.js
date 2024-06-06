import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from 'firebaseClient'; // Ensure the import path is correct
import axios from 'axios';
import Moralis from 'moralis'; // Import Moralis
import BlinkingText from './BlinkingText'; // Import the BlinkingText component

const SignIn = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [metaMaskAccount, setMetaMaskAccount] = useState(null);
  const [moralisProfileName, setMoralisProfileName] = useState(null); // State for Moralis profile name
  const [moralisBalance, setMoralisBalance] = useState(null); // State for Moralis balance
  const [isMetaMaskRequestPending, setMetaMaskRequestPending] = useState(false);
  const [isGoogleLoginPending, setIsGoogleLoginPending] = useState(false);
  const [moralisLoginStatus, setMoralisLoginStatus] = useState(''); // State for Moralis login status
  const [isMoralisLoggedIn, setIsMoralisLoggedIn] = useState(false); // State for Moralis login status

  // Flag to track initialization status
  let isMoralisInitialized = false;

  // Function to initialize Moralis once
  const initializeMoralisOnce = async () => {
    try {
      if (!isMoralisInitialized) {
        console.log('Starting Moralis...');
        await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
        console.log('Moralis started successfully');
        isMoralisInitialized = true; // Set the flag to true after initialization
      } else {
        console.log('Moralis already initialized');
      }
    } catch (error) {
      console.error('Error initializing Moralis:', error);
    }
  };

  // Memoized function to fetch Moralis wallet info
  const fetchMoralisWalletInfo = useCallback(async (userId, address) => {
    console.log('Fetching Moralis wallet info for address:', address); // Logging address
    if (!address) {
      console.error("Invalid address for fetching Moralis wallet info");
      return;
    }

    try {
      setMoralisLoginStatus('Connecting to Moralis...');
      await initializeMoralisOnce();

      const balance = await Moralis.Web3API.account.getNativeBalance({ address });
      const ethBalance = Moralis.Units.FromWei(balance.balance);
      console.log('Balance fetched:', ethBalance);

      const moralisUser = Moralis.User.current();
      let profileName = moralisUser ? moralisUser.get('username') : null;

      if (!profileName) {
        profileName = `User_${Math.floor(Math.random() * 1000000)}`;
        if (moralisUser) {
          moralisUser.set('username', profileName);
          await moralisUser.save();
          console.log("New Moralis user profile name created: ", profileName);
        }
      }

      setMoralisProfileName(profileName);
      setMoralisBalance(ethBalance);
      setMoralisLoginStatus('Connected to Moralis');

      const docRef = doc(db, 'moralis-accounts', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await saveMoralisAccountData(userId, profileName, ethBalance);
      }
      
      console.log('Moralis profile name:', profileName);
      console.log('Moralis balance:', ethBalance);
    } catch (error) {
      setMoralisLoginStatus('Failed to connect to Moralis');
      console.error('Error fetching Moralis wallet info:', error);
    }
  }, []);

  // Function to check if Moralis is already logged in
  const checkMoralisLoginStatus = useCallback(async () => {
    try {
      console.log('Checking Moralis login status...');
      await initializeMoralisOnce();
      console.log('Moralis initialized for login status check');

      const moralisUser = Moralis.User.current();
      console.log('Moralis current user:', moralisUser);
      if (moralisUser) {
        console.log("Moralis user is already logged in:", moralisUser);
        setIsMoralisLoggedIn(true);
        const address = moralisUser.get('ethAddress');
        if (address) {
          fetchMoralisWalletInfo(moralisUser.id, address);
        }
      } else {
        console.log("Moralis user is not logged in");
        setIsMoralisLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking Moralis login status:', error);
    }
  }, [fetchMoralisWalletInfo]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const data = await getUserData(user.uid);
        setUserData(data);
        if (metaMaskAccount) {
          fetchMoralisWalletInfo(user.uid, metaMaskAccount);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          const loggedInUser = result.user;
          setUser(loggedInUser);

          saveUserData(loggedInUser.uid, loggedInUser.displayName, loggedInUser.email)
            .then(() => getUserData(loggedInUser.uid))
            .then((data) => setUserData(data));

          if (metaMaskAccount) {
            fetchMoralisWalletInfo(loggedInUser.uid, metaMaskAccount);
          }
        }
      })
      .catch((error) => {
        console.error('Error handling redirect result:', error);
      });

    checkMoralisLoginStatus(); // Check Moralis login status on component mount

    return () => unsubscribe();
  }, [metaMaskAccount, fetchMoralisWalletInfo, checkMoralisLoginStatus]);

  const saveUserData = async (userId, name, email, address = null) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        username: name,
        email: email,
        address: address,
      });
      console.log(`User data saved for ${userId}`);
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
      console.log('No data available');
      return null;
    }
  };

  const saveMoralisAccountData = async (userId, profileName, balance) => {
    if (!profileName || balance === null) {
      console.error("Invalid profile name or balance for Moralis account");
      return;
    }

    try {
      await setDoc(doc(db, 'moralis-accounts', userId), {
        profileName: profileName,
        balance: balance,
      });
      console.log(`Moralis account data saved for ${userId}`);
    } catch (error) {
      console.error("Error saving Moralis account data:", error);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Login Clicked');
    setIsGoogleLoginPending(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithRedirect(auth, provider);
  };

  const handleMetaMaskLogin = async () => {
    console.log('MetaMask Login Clicked');
    if (isMetaMaskRequestPending) {
      console.error('MetaMask permission request already pending. Please wait.');
      return;
    }

    setMetaMaskRequestPending(true);

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3 = new Web3(window.ethereum);
        console.log('Web3 Instance:', web3);

        const accounts = await web3.eth.requestAccounts();
        console.log('Accounts:', accounts);

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found.');
        }

        const address = accounts[0];
        console.log('Account Address:', address);
        setMetaMaskAccount(address);

        await setDoc(doc(db, 'metamask-login', address), { address });
        console.log(`MetaMask data saved for ${address}`);

        const response = await axios.post('/api/auth', { address });
        if (response.data.success) {
          const token = response.data.token;
          const userCredential = await signInWithCustomToken(auth, token);
          setUser(userCredential.user);
          fetchMoralisWalletInfo(userCredential.user.uid, address);
        } else {
          console.error('Authentication failed:', response.data.error);
        }
      }
    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
    } finally {
      setMetaMaskRequestPending(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout Clicked');
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setMetaMaskAccount(null);
      setMoralisProfileName(null);
      setMoralisBalance(null);
      setMoralisLoginStatus('');
      setIsMoralisLoggedIn(false);
      console.log('User signed out');
      if (window.ethereum && window.ethereum.isMetaMask) {
        window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        }).then(() => window.location.reload());
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <BlinkingText /> {/* Use the BlinkingText component */}
      {!user && !metaMaskAccount ? (
        <>
          <button
            onClick={handleGoogleLogin}
            className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
            disabled={isGoogleLoginPending}
          >
            Login with Google
          </button>
          <button
            onClick={handleMetaMaskLogin}
            className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
            disabled={isMetaMaskRequestPending}
          >
            Login with MetaMask
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
              <p><strong>MetaMask Account:</strong> {metaMaskAccount}</p>
            </>
          )}
          {moralisProfileName && (
            <>
              <p><strong>Moralis Profile Name:</strong> {moralisProfileName}</p>
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
        </div>
      )}
    </div>
  );
};

export default SignIn;
