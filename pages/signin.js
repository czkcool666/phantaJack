import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from 'firebaseClient'; // Ensure the import path is correct
import axios from 'axios';
import { authenticateWithMagic, getCurrentUser, authenticateWithMetaMask } from './moralisAdd'; // Import the customized Moralis
import { Magic } from 'magic-sdk'; // Import Magic SDK
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
  const [magic, setMagic] = useState(null); // State for Magic instance

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      setMagic(magicInstance);
    }
  }, []);

  const fetchMoralisWalletInfo = useCallback(async (address) => {
    console.log('Fetching Moralis wallet info for address:', address);
    if (!address) {
      console.error("Invalid address for fetching Moralis wallet info");
      return;
    }
  
    try {
      setMoralisLoginStatus('Connecting to Moralis...');
  
      const moralisUser = getCurrentUser();
      console.log('Moralis current user:', moralisUser);
  
      if (moralisUser) {
        let profileName = moralisUser.username || `User_${Math.floor(Math.random() * 1000000)}`;
  
        if (!moralisUser.username) {
          moralisUser.username = profileName;
          // Save the username and other user data to your backend or Moralis server if necessary
        }
  
        setMoralisProfileName(profileName);
        setMoralisBalance(moralisUser.balance); // Directly use the balance from the currentUser object
        setMoralisLoginStatus('Connected to Moralis');
  
        // Use the Ethereum address as the document ID
        const docRef = doc(db, 'moralis-accounts', address);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          await saveMoralisAccountData(address, profileName, moralisUser.balance);
        }
  
        console.log('Moralis profile name:', profileName);
        console.log('Moralis balance:', moralisUser.balance);
      } else {
        console.error('Moralis user is null');
      }
    } catch (error) {
      setMoralisLoginStatus('Failed to connect to Moralis');
      console.error('Error fetching Moralis wallet info:', error);
    }
  }, []);
  
  const checkMoralisLoginStatus = useCallback(async () => {
    try {
      console.log('Checking Moralis login status...');

      const moralisUser = getCurrentUser();
      console.log('Moralis current user:', moralisUser); // Add log to check moralisUser

      if (moralisUser) {
        console.log("Moralis user is already logged in:", moralisUser);
        setIsMoralisLoggedIn(true);
        const address = moralisUser.ethAddress;
        if (address) {
          fetchMoralisWalletInfo(moralisUser?.id, address);
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
    if (metaMaskAccount) {
      alert("You need to disconnect MetaMask in order to login with Google");
      return;
    }
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
      const user = await authenticateWithMetaMask();
      setMetaMaskAccount(user.ethAddress);
      setUser(user);
      fetchMoralisWalletInfo(user.ethAddress);
    } catch (error) {
      console.error('Error during MetaMask authentication:', error);
    } finally {
      setMetaMaskRequestPending(false);
    }
  };

  const handleMagicLogin = async (magicInstance) => {
    console.log('Magic Link Login Clicked');
    try {
      if (!user) {
        console.error('No user logged in with Google.');
        return;
      }
      const email = user.email; // Assuming user is already logged in with Google
      const didToken = await magicInstance.auth.loginWithMagicLink({ email });
      console.log('Magic Link didToken:', didToken);

      // Authenticate with Moralis using didToken
      const moralisUser = await authenticateWithMagic(didToken);
      if (moralisUser) {
        const address = moralisUser.ethAddress;
        setMetaMaskAccount(address); // Using the same state for MagicLink account
        fetchMoralisWalletInfo(user.uid, address);

        console.log('Magic Link login successful');
      } else {
        console.error('Failed to authenticate with Moralis using MagicLink');
      }
    } catch (error) {
      console.error('Error during Magic Link login:', error);
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
      
      // No longer prompting MetaMask login on logout
      window.location.reload();
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
              <p><strong>Account Address:</strong> {metaMaskAccount}</p>
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
          {!isMoralisLoggedIn && (
            <button
              onClick={() => handleMagicLogin(magic)}
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