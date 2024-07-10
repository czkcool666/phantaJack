// pages/_app.js
import '../styles/globals.css';
import '../styles/background.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [persister, setPersister] = useState(null);

  useEffect(() => {
    // Initialize Firebase
    if (!getApps().length) {
      initializeApp(firebaseConfig); // Only initialize if no apps exist
    }

    // Check if window is available and set the persister
    if (typeof window !== 'undefined') {
      const storagePersister = createSyncStoragePersister({
        serialize: JSON.stringify,
        storage: window.localStorage,
        deserialize: JSON.parse,
      });
      setPersister(storagePersister);
    }
  }, []);

  return (
    <SessionProvider session={session}>
      {persister ? (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
          contextSharing={true} // Add contextSharing option
        >
          <Component {...pageProps} />
        </PersistQueryClientProvider>
      ) : (
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <Component {...pageProps} />
        </QueryClientProvider>
      )}
    </SessionProvider>
  );
}

export default MyApp;
