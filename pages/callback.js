import { useEffect } from 'react';
import { useRouter } from 'next/router';
import magic from '../magic';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Handling callback...');
        const result = await magic.oauth.getRedirectResult();
        console.log('OAuth result:', result);
        // Check if the result contains the necessary fields
        if (result.oauth && result.oauth.userHandle) {
          router.push('/user');
        } else {
          throw new Error('Invalid OAuth result');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
        // Redirect to an error page or show a message
        router.push('/error');
      }
    };

    handleCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
