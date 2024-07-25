import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

let magic;

if (typeof window !== 'undefined') {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGICLINK_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()],
  });
}

// Function to handle Google login with redirect
export async function signinMagicLink() {
  try {
    await magic.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI: 'http://localhost:3000/magicCallback', // Ensure this matches your callback URL
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
  
}


