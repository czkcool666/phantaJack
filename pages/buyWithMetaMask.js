import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftAddress, nftABI } from '../config'; // Ensure these are for the testnet deployment

let userAddress = null;

export const buyWithMetaMask = async (nftPrice) => {
  try {
    // Initialize Web3Modal and connect to MetaMask
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();

    // Check if MetaMask is connected to the desired testnet (e.g., Sepolia)
    const web3Provider = new ethers.providers.Web3Provider(instance);
    const network = await web3Provider.getNetwork();
    if (network.chainId !== 11155111) { // Replace with the chainId of your testnet, e.g., 11155111 for Sepolia
      throw new Error('Please switch your MetaMask network to the Sepolia testnet.');
    }

    const userSigner = web3Provider.getSigner();
    userAddress = await userSigner.getAddress();
    const userBalance = await web3Provider.getBalance(userAddress);
    const contract = new ethers.Contract(nftAddress, nftABI, userSigner);

    console.log('User Address:', userAddress);
    console.log('User Balance:', ethers.utils.formatEther(userBalance));

    // Ensure that the user has enough balance to cover both the mint price and the gas fee
    const totalCost = ethers.utils.parseEther(nftPrice.toString());
    if (userBalance.lt(totalCost)) {
      throw new Error('Insufficient funds to mint the NFT.');
    }

    // Set a reasonable gas price and gas limit
    const gasPrice = await web3Provider.getGasPrice();
    const gasLimit = ethers.utils.hexlify(100000); // Set a lower manual gas limit for testing

    // Mint NFT by sending a transaction to the smart contract
    const tx = await contract.mint({
      value: totalCost,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
    });
    console.log('Transaction sent:', tx);
    await tx.wait();
    console.log('Transaction confirmed:', tx);
    
    // Store the login method and redirect to the success page
    localStorage.setItem('loginMethod', 'metamask');
    window.location.href = '/success';

    return { success: true, message: 'Transaction confirmed! You have successfully purchased an NFT.' };
  } catch (error) {
    console.error('Error:', error);
    if (error.code === -32000 && error.message.includes('insufficient funds')) {
      return { success: false, message: 'The balance is insufficient.' };
    } else {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export { userAddress };
export default buyWithMetaMask;
