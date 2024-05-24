import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

let magic;

if (typeof window !== 'undefined') {
  if (!magic) {
    magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
      extensions: [new OAuthExtension()],
    });
  }
}

export default magic;
