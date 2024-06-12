import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [magic, setMagic] = useState(null);

  useEffect(() => {
    if (!magic && typeof window !== 'undefined') {
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
        extensions: [new OAuthExtension()],
      });
      setMagic(magicInstance);
    }

    // Initialize Firebase
    if (!getApps().length) {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      initializeApp(firebaseConfig); // Only initialize if no apps exist
    }
  }, [magic]);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SessionProvider session={session}>
        <Component {...pageProps} magic={magic} />
      </SessionProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
