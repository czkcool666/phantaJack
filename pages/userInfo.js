// pages/userinfo.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Moralis from 'moralis';
import Web3 from 'web3';

const UserInfo = () => {
  const router = useRouter();
  const [moralisProfileName, setMoralisProfileName] = useState(null);
  const [moralisBalance, setMoralisBalance] = useState(null);
  const [web3authBalance, setWeb3AuthBalance] = useState(null);
  const [web3authLoginStatus, setWeb3AuthLoginStatus] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const moralisUser = Moralis.User.current();
      if (moralisUser) {
        setMoralisProfileName(moralisUser.getUsername());
        setMoralisBalance(moralisUser.get('ethAddress'));

        const web3authInstance = Moralis.Web3Auth;
        if (web3authInstance) {
          const web3 = new Web3(web3authInstance.provider);
          const accounts = await web3.eth.getAccounts();
          const balance = await web3.eth.getBalance(accounts[0]);
          const ethBalance = Web3.utils.fromWei(balance, 'ether');
          setWeb3AuthBalance(ethBalance);
          setWeb3AuthLoginStatus('Connected to Web3Auth');
        }
      } else {
        router.push('/signin');
      }
    };

    fetchUserInfo();
  }, [router]);

  return (
    <div className="background">
      <div className="bubble"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-transparent">
        <div className="mt-8 p-4 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold">User Info:</h2>
          {moralisProfileName && <p><strong>Moralis Profile Name:</strong> {moralisProfileName}</p>}
          {moralisBalance !== null && <p><strong>Moralis Balance:</strong> {moralisBalance} ETH</p>}
          <p><strong>Moralis Login Status:</strong> Connected to Moralis</p>
          {web3authLoginStatus && <p><strong>Web3Auth Login Status:</strong> {web3authLoginStatus}</p>}
          {web3authBalance !== null && <p><strong>Web3Auth Balance:</strong> {web3authBalance} ETH</p>}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
