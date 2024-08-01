// SuccessWeb3Auth.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";
import { mintNFTWithStripe } from "./buyWithWeb3Auth";

const SuccessWeb3Auth = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [nftNames, setNftNames] = useState([]);
  const [nftError, setNftError] = useState("");
  const [stripeSessionId, setStripeSessionId] = useState("");

  useEffect(() => {
    const storedAddress = localStorage.getItem('web3authWalletAddress');
    const storedSessionId = localStorage.getItem('stripeSessionId');
    if (storedAddress) {
      setWalletAddress(storedAddress);
      setStripeSessionId(storedSessionId);
      checkBalance(storedAddress);
      fetchNFTs(storedAddress);
      // Call mintNFTWithStripe only if the session ID is new
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const newSessionId = urlParams.get('session_id');
      if (newSessionId && newSessionId !== storedSessionId) {
        mintNFTWithStripe().then(() => {
          localStorage.setItem('stripeSessionId', newSessionId);
        });
      }
    }
  }, []);

  const checkBalance = async (address) => {
    try {
      const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/fZ-HHD0oPbeUz9lNko4cViCJDIxYbiuh');
      const balance = await web3.eth.getBalance(address);
      const ethBalance = web3.utils.fromWei(balance, 'ether');
      setEthBalance(ethBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchNFTs = async (address) => {
    try {
      const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}/nft`, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        },
        params: {
          chain: 'eth',
          format: 'decimal',
        },
      });
      if (response.data.result && response.data.result.length > 0) {
        const nftNames = response.data.result.map(nft => nft.name || 'Unnamed NFT');
        setNftNames(nftNames);
      } else {
        setNftError("No NFTs in this address");
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNftError("NFT check failed");
    }
  };

  return (
    <div>
      <h1>Transaction Successful</h1>
      <p>Congrats, you've purchased an NFT.</p>
      {walletAddress && (
        <div>
          <p>Account: {walletAddress}</p>
          <p>ETH Balance: {ethBalance} ETH</p>
          {nftNames.length > 0 ? (
            <div>
              <h2>NFTs:</h2>
              <ul>
                {nftNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>{nftError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuccessWeb3Auth;
