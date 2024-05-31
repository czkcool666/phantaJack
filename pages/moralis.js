import Moralis from 'moralis';
import Web3 from 'web3';
import React from 'react';

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

const MoralisPage = () => {
  return (
    <div>
      <h1>Moralis Page</h1>
    </div>
  );
};

export default MoralisPage;
