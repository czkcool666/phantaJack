// /pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { auth, provider, db } from 'firebaseClient'; // Ensure the import path is correct

let magic;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [magicInstance, setMagicInstance] = useState(null);

  useEffect(() => {
    if (!magic && typeof window !== 'undefined') {
      const { Magic } = require('magic-sdk');
      const { OAuthExtension } = require('@magic-ext/oauth');
      magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
        extensions: [new OAuthExtension()],
      });
      setMagicInstance(magic);
    } else {
      setMagicInstance(magic);
    }

    // Initialize Firebase
    if (!getApps().length) {
      initializeApp(firebaseConfig); // Only initialize if no apps exist
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} magic={magicInstance} />
    </SessionProvider>
  );
}

export default MyApp;
