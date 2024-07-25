// hooks/useWeb3Auth.js
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { initializeWeb3Auth } from './src/web3authInit'; // Adjust the path as needed
import { nftAddress, nftABI } from './config'; // Ensure these paths are correct

const useWeb3Auth = () => {
  const [web3auth, setWeb3Auth] = useState(null);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3authAddress, setWeb3AuthAddress] = useState(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const { web3auth, walletServicesPlugin } = await initializeWeb3Auth();
        setWeb3Auth(web3auth);
        setWalletServicesPlugin(walletServicesPlugin);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();
  }, []);

  const loginWithWeb3Auth = async () => {
    try {
      if (!walletServicesPlugin) {
        throw new Error("WalletServicesPlugin not found");
      }

      let currentProvider;
      if (!web3auth.connected) {
        currentProvider = await web3auth.connect();
        setProvider(currentProvider);
      } else {
        currentProvider = web3auth.provider;
        setProvider(currentProvider);
      }

      await walletServicesPlugin.showWalletUI();

      const web3 = new Web3(currentProvider);
      const accounts = await web3.eth.getAccounts();
      setWeb3AuthAddress(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
      localStorage.setItem('loginMethod', "web3auth");

      return web3;
    } catch (error) {
      if (error.message === "User closed the modal") {
        console.log("User closed the modal");
        return null;
      } else {
        console.error('Error during Web3Auth login:', error);
        throw error;
      }
    }
  };

  const getEthBalance = async (web3, address) => {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  };

  const mintNFTWithETH = async (nftPrice) => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(nftAddress, nftABI, signer);

      const tx = await contract.mint({ value: ethers.utils.parseEther(nftPrice.toString()) });
      await tx.wait();

      localStorage.setItem('walletAddress', web3authAddress);
      localStorage.setItem('txHash', tx.hash);

      window.location.href = `/succes]s?txHash=${tx.hash}&walletAddress=${web3authAddress}`;
      return { success: true, message: 'Transaction confirmed! You have successfully purchased an NFT.' };
    } catch (error) {
      console.error('Transaction failed:', error);
      return { success: false, message: `Error: ${error.message}` };
    }
  };

  const buyWithWeb3Auth = async (nftPrice) => {
    try {
      const web3 = await loginWithWeb3Auth();
      if (!web3) {
        return { success: false, message: 'Authentication was cancelled.' };
      }
      const balance = await getEthBalance(web3, web3authAddress);

      if (parseFloat(balance) < nftPrice) {
        return { success: false, message: 'Insufficient ETH balance. Please deposit more ETH and try again.' };
      } else {
        const result = await mintNFTWithETH(nftPrice);
        return result;
      }
    } catch (error) {
      console.error('Error in buyWithWeb3Auth:', error);
      return { success: false, message: `Error: ${error.message}` };
    }
  };

  return { buyWithWeb3Auth, web3authAddress, provider };
};

export default useWeb3Auth;
