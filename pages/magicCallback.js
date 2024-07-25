import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

let magic;

if (typeof window !== 'undefined') {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGICLINK_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()],
  });
}

const MagicCallback = () => {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        const result = await magic.oauth.getRedirectResult();
        console.log('OAuth result:', result);

        // Save user info to local storage or state
        localStorage.setItem('user', JSON.stringify(result));

        // Redirect to the purchase page
        router.push('/buyNFT?status=success');
      } catch (error) {
        console.error('Error handling callback:', error);
        router.push('/buyNFT?status=failed');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div>
      <h1>Processing...</h1>
    </div>
  );
};

export default MagicCallback;
