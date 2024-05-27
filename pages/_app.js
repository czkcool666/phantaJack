import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} magic={magicInstance} />
    </SessionProvider>
  );
}

export default MyApp;
