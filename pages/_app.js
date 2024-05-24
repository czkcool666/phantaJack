import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { MoralisProvider } from 'react-moralis';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [magic, setMagic] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Magic } = require('magic-sdk');
      const { OAuthExtension } = require('@magic-ext/oauth');
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
        extensions: [new OAuthExtension()],
      });
      setMagic(magicInstance);
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <MoralisProvider initializeOnMount={false}>
        <Component {...pageProps} magic={magic} />
      </MoralisProvider>
    </SessionProvider>
  );
}

export default MyApp;
