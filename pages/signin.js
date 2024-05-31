import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { signInWithPopup, onAuthStateChanged, signInWithCustomToken, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, provider, db } from '../firebaseClient'; // Ensure the import path is correct
import axios from 'axios';
import magic from '../magic'; // Import your Magic instance

const SignIn = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMetaMaskRequestPending, setMetaMaskRequestPending] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).catch((error) => {
        console.error('MetaMask RPC Error:', error);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleGoogleLogin = async () => {
    console.log('Google Login Clicked');
    if (magic) {
      console.log('Magic Instance:', magic);
      await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `${window.location.origin}/signin`,
      });
    } else {
      try {
        const result = await signInWithPopup(auth, provider);
        const loggedInUser = result.user;
        setUser(loggedInUser);

        // Create a custom token for the user
        const response = await axios.post('http://localhost:3000/createCustomToken', { uid: loggedInUser.uid });

        const customToken = response.data.token;

        // Sign in with the custom token
        const userCredential = await signInWithCustomToken(auth, customToken);
        const user = userCredential.user;
        setUser(user);

        // Save user info to Firestore
        await saveUserData(loggedInUser.uid, loggedInUser.displayName, loggedInUser.email);
        const data = await getUserData(loggedInUser.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    }
  };

  const handleMetaMaskLogin = async () => {
    console.log('MetaMask Login Clicked');
    if (isMetaMaskRequestPending) {
      console.error('MetaMask permission request already pending. Please wait.');
      return;
    }

    setMetaMaskRequestPending(true);

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

        const response = await axios.post('/api/auth', { address });
        if (response.data.success) {
          const token = response.data.token;
          const userCredential = await signInWithCustomToken(auth, token);
          setUser(userCredential.user);
          await saveUserData(userCredential.user.uid, null, null, address);
          const data = await getUserData(userCredential.user.uid);
          setUserData(data);
        } else {
          console.error('Authentication failed:', response.data.error);
        }
      }
    } catch (error) {
      if (error.code === -32002) {
        console.error('MetaMask permission request already pending. Please wait.');
      } else {
        console.error('Error during MetaMask authentication:', error);
      }
    } finally {
      setMetaMaskRequestPending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-tech">
      <h1 className="text-6xl font-bold mb-8 text-white font-Lobster">PhantaField</h1>
      {!user ? (
        <>
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
        </div>
      )}
    </div>
  );
};

export default SignIn;
