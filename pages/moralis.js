import Moralis from 'moralis';

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY, // Ensure this is set in your .env.local file
});

export default Moralis;
