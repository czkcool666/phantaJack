import Web3 from "web3";
import { ethers } from "ethers";
import { nftAddress, nftABI } from '../config';
import { initializeWeb3Auth } from '../src/web3authInit';

let provider;
let web3authAddress = null;
let web3auth;
let walletServicesPlugin;



const loginWithWeb3Auth = async () => {
  try {
    const initResult = await initializeWeb3Auth();
    web3auth = initResult.web3auth;
    walletServicesPlugin = initResult.walletServicesPlugin;

    if (!walletServicesPlugin) {
      throw new Error("WalletServicesPlugin not found");
    }

    if (!web3auth) {
      console.log("Web3Auth not initialized. Initializing now...");
      await web3auth.initModal(); // Ensure the modal is initialized if not done in the init function
    }

    provider = await web3auth.connect();
    console.log("Web3Auth connected:", provider);

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log('Web3Auth connected account:', accounts[0]);
    web3authAddress = accounts[0];
    walletServicesPlugin.on("connected", () => { walletServicesPlugin.showWalletUi();})


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

const mintNFTWithETH = async (nftPrice) => {
  try {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(nftAddress, nftABI, signer);

    const tx = await contract.mint({ value: ethers.utils.parseEther(nftPrice.toString()) });
    await tx.wait();

    console.log('Transaction sent:', tx);

    localStorage.setItem('walletAddress', web3authAddress);
    localStorage.setItem('txHash', tx.hash); // Store transaction hash

    window.location.href = `/success?txHash=${tx.hash}&walletAddress=${web3authAddress}`;
    return { success: true, message: 'Transaction confirmed! You have successfully purchased an NFT.' };
  } catch (error) {
    console.error('Transaction failed:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

export { buyWithWeb3Auth, web3authAddress, provider };
