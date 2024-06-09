import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MagicProvider from '../components/magic/MagicProvider'; // Adjust the path as necessary

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MagicProvider>
      <Component {...pageProps} />
    </MagicProvider>
  );
}

export default MyApp;
