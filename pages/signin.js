import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../src/firebase/firebaseClient';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import BlinkingText from './BlinkingText';
import '../styles/background.css';

const SignIn = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {

    try {
      // Initialize a new Google Auth provider instance each time the button is clicked
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in local storage
      localStorage.setItem('userName', user.displayName);
      localStorage.setItem('userEmail', user.email);

      // Redirect to purchase page or any other page
      router.push('/buyNFT');
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <BlinkingText />
        <button
          onClick={handleGoogleLogin}
          className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
