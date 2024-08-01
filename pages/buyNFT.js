// buyNFT.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMoralis } from 'react-moralis'; // Import useMoralis hook
import BlinkingText from './BlinkingText';
import '../styles/background.css';
import { buyWithMetaMask } from './buyWithMetaMask';
import { buyWithWeb3Auth } from './buyWithWeb3Auth'; // Remove setNftPriceUsd
import { initializeWeb3Auth } from '../src/web3authInit'; 

const BuyNFT = () => {
  const { enableWeb3, isWeb3Enabled } = useMoralis(); // Get Moralis hooks
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [nftPriceEth, setNftPriceEth] = useState(0.008); // NFT price in ETH
  const [ethToUsdRate, setEthToUsdRate] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const rate = data.ethereum.usd;
        setEthToUsdRate(rate);
      } catch (error) {
        console.error('Error fetching ETH to USD rate:', error);
      }
    };

    fetchEthToUsdRate();

    // Ensure Web3 is enabled when the component mounts
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('web3authUserEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      router.push('/signin');
    }
  }, [router]);

  useEffect(() => {
    const { status } = router.query;
    if (status === 'success') {
      setMessage('Purchase Success');
    } else if (status === 'failed') {
      setMessage('Purchase Failed');
    }
  }, [router.query]);

  const handleMetaMaskPayment = async () => {
    const result = await buyWithMetaMask(nftPriceEth);
    setMessage(result.message);
  };

  const handleWeb3AuthPayment = async () => {
    if (ethToUsdRate) {
      const nftPriceUsd = (nftPriceEth * ethToUsdRate).toFixed(2);
      const result = await buyWithWeb3Auth(nftPriceUsd);
      setMessage(result.message);
    } else {
      setMessage("Unable to fetch ETH to USD rate.");
    }
  };

  const handleLogout = async () => {
    try {
      const { web3auth } = await initializeWeb3Auth();
      await web3auth.logout();
      localStorage.removeItem('web3authWalletAddress');
      localStorage.removeItem('web3authUserEmail');
      localStorage.removeItem('loginMethod');
      router.push('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <BlinkingText />
        <div className="mt-8 p-4 bg-white rounded shadow-md flex flex-col items-center">
          <h4 className="text-2xl font-bold">Hello, {userEmail}</h4>
          <h3 className="text-xl">
            NFT Price: {nftPriceEth} ETH 
            {ethToUsdRate && <span> (~${(nftPriceEth * ethToUsdRate).toFixed(2)} USD)</span>}
          </h3>

          <button
            onClick={handleMetaMaskPayment}
            className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
          >
            Pay with MetaMask
          </button>

          <button
            onClick={handleWeb3AuthPayment}
            className="common-btn bg-gradient-to-r from-teal-500 via-green-500 to-lime-500 hover:from-teal-700 hover:via-green-700 hover:to-lime-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
          >
            Pay with Stripe
          </button>

          <button
            onClick={handleLogout}
            className="common-btn bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4 w-full"
          >
            Logout
          </button>

          {message && <p className="mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default BuyNFT;
