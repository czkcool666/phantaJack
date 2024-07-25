import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import Web3 from 'web3';
import '../styles/background.css';

const config = require('../config');
const nftAddress: string = config.nftAddress;
const nftABI: any[] = config.nftABI;


let magic: Magic | any;

if (typeof window !== 'undefined') {
// Initialize Magic instance with your Publishable API Key
  magic = new Magic(process.env.NEXT_PUBLIC_MAGICLINK_PUBLISHABLE_API_KEY as string, {
  network: {
    rpcUrl: "https://rpc2.sepolia.org/",
    chainId: 11155111,
  },
});
}

const BuyWithMagicLink = () => {
  const [userAddress, setUserAddress] = useState<string>('');
  const [userBalance, setUserBalance] = useState<string>('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [nftPrice, setNftPrice] = useState<number>(0.008); // NFT price in ETH
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  // Authenticate the user using Magic Wallet UI
  const connectWithMagicLink = async () => {
    try {
      await magic.wallet.connectWithUI();
      const web3Instance = new Web3(magic.rpcProvider as any);
      setWeb3(web3Instance);
      const address = (await web3Instance.eth.getAccounts())[0];
      setUserAddress(address);
      const balance = await web3Instance.eth.getBalance(address);
      setUserBalance(web3Instance.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  // Display Magic Wallet UI
  const showMagicWallet = async () => {
    try {
      await magic.wallet.showUI();
    } catch (error) {
      console.error('Error displaying wallet:', error);
      setMessage('Unable to display wallet. Please try again.');
    }
  };

  // Mint NFT function
  const mintNFT = async () => {
    try {
      if (!web3) throw new Error('Web3 is not initialized');
      const contract = new web3.eth.Contract(nftABI as any, nftAddress); // Replace nftABI and nftAddress with your contract details
      const totalCost = web3.utils.toWei(nftPrice.toString(), 'ether');
      const gas = await contract.methods.mint().estimateGas({ from: userAddress, value: totalCost });

      const tx = await contract.methods.mint().send({
        from: userAddress,
        value: totalCost,
        gas: gas.toString(),
      });

      console.log('Transaction sent:', tx);
      setMessage('Transaction confirmed! You have successfully purchased an NFT.');
      localStorage.setItem('loginMethod', 'magiclink');
      router.push('/success');
    } catch (error) {
      console.error('Error during transaction:', error);
      setMessage('Transaction failed. Please try again.');
    }
  };

  useEffect(() => {
    // Check if the user is already logged in
    const checkUserLoggedIn = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const web3Instance = new Web3(magic.rpcProvider as any);
          setWeb3(web3Instance);
          const address = (await web3Instance.eth.getAccounts())[0];
          setUserAddress(address);
          const balance = await web3Instance.eth.getBalance(address);
          setUserBalance(web3Instance.utils.fromWei(balance, 'ether'));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <div className="mt-8 p-4 bg-white rounded shadow-md flex flex-col items-center">
          {!userAddress ? (
            <>
              <h4 className="text-2xl font-bold">Login to Purchase NFT</h4>
              <button
                onClick={connectWithMagicLink}
                className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
              >
                Login with Magic Link
              </button>
            </>
          ) : (
            <>
              <h4 className="text-2xl font-bold">Hello, {userAddress}</h4>
              <h3 className="text-xl">Balance: {userBalance} ETH</h3>
              <h3 className="text-xl">NFT Price: {nftPrice} ETH</h3>
              <button
                onClick={showMagicWallet}
                className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
              >
                Show Wallet
              </button>
              <button
                onClick={mintNFT}
                className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
              >
                Buy NFT
              </button>
              {message && <p className="mt-4">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyWithMagicLink;
