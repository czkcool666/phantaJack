import { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";

const SuccessPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [nftNames, setNftNames] = useState([]);
  const [nftError, setNftError] = useState("");
  const [loginMethod, setLoginMethod] = useState("");

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    const method = localStorage.getItem('loginMethod'); // Retrieve the login method
    if (storedAddress) {
      setWalletAddress(storedAddress);
      setLoginMethod(method);
      console.log(`Stored Address: ${storedAddress}, Login Method: ${method}`);
      if (method === 'web3auth') {
        checkBalance(storedAddress);
        fetchNFTs(storedAddress);
      }
    }
  }, []);

  const checkBalance = async (address) => {
    try {
      const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/fZ-HHD0oPbeUz9lNko4cViCJDIxYbiuh'); // Replace with your Alchemy API URL
      const balance = await web3.eth.getBalance(address);
      const ethBalance = web3.utils.fromWei(balance, 'ether');
      setEthBalance(ethBalance);
      console.log(`ETH Balance: ${ethBalance}`);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchNFTs = async (address) => {
    try {
      const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}/nft`, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY, // Replace with your Moralis API key
        },
        params: {
          chain: 'eth',
          format: 'decimal',
        },
      });
      if (response.data.result && response.data.result.length > 0) {
        const nftNames = response.data.result.map(nft => nft.name || nft.metadata.name || 'Unnamed NFT');
        setNftNames(nftNames);
        console.log('NFT Names:', nftNames);
      } else {
        setNftError("No NFTs in this address");
        console.log('No NFTs found in this address');
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNftError("NFT check failed");
    }
  };

  return (
    <div>
      <h1>Transaction Successful</h1>
      {walletAddress ? (
        <div>
          {loginMethod === 'metamask' ? (
            <div>
              <p>Congrats, You've purchased an NFT.</p>
              <p>Now you can see NFT in your wallet</p>
            </div>
          ) : loginMethod === 'web3auth' ? (
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
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SuccessPage;
