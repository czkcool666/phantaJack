import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import { nftAddress, nftABI } from '../config';
import BlinkingText from './BlinkingText';
import '../styles/background.css';
import AddressTaxCalculator from './AddressTaxCalculator';

const Purchase = () => {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [taxRate, setTaxRate] = useState(null);
  const [nftPrice, setNftPrice] = useState(0.001); // Set the NFT price to 0.001 ETH for the development stage

  const loadProvider = async () => {
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(instance);
    const userSigner = web3Provider.getSigner();
    const userAddress = await userSigner.getAddress();
    const userBalance = await web3Provider.getBalance(userAddress);
    const contract = new ethers.Contract(nftAddress, nftABI, userSigner);

    setProvider(web3Provider);
    setSigner(userSigner);
    setAccount(userAddress);
    setBalance(ethers.utils.formatEther(userBalance));
    setNftContract(contract);
  };

  useEffect(() => {
    loadProvider();
  }, []);

  const purchaseNFT = async () => {
    if (!nftContract) return;

    try {
      const tx = await nftContract.mint({ value: ethers.utils.parseEther(nftPrice.toString()) });
      setMessage('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setMessage('Transaction confirmed! You have successfully purchased an NFT.');
    } catch (error) {
      if (error.code === -32000 && error.message.includes('insufficient funds')) {
        setErrorMessage('The balance is insufficient');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    if (provider && provider.provider && provider.provider.disconnect) {
      await provider.provider.disconnect();
    }
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setBalance(null);
    setNftContract(null);
    setMessage('');
    setErrorMessage('');
    router.push('/signin');
  };

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <BlinkingText />
        {account ? (
          <div className="mt-8 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold">User Info:</h2>
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
            <AddressTaxCalculator taxRate={taxRate} setTaxRate={setTaxRate} nftPrice={nftPrice} />
            <button
              onClick={purchaseNFT}
              className="common-btn bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4"
            >
              Purchase NFT
            </button>
            {message && <p>{message}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              onClick={handleLogout}
              className="common-btn bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mt-4"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={loadProvider}
            className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Purchase;
