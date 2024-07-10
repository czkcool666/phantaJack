import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID; // Your Web3Auth Client ID

const chainConfig = {
  chainId: "0xaa36a7", // Sepolia testnet
  rpcTarget: "https://eth-sepolia.g.alchemy.com/v2/fZ-HHD0oPbeUz9lNko4cViCJDIxYbiuh", // Replace with your Alchemy API key
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Ethereum Sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://images.toruswallet.io/eth.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

export const initializeWeb3Auth = async () => {
  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET, // Change to MAINNET for production
    privateKeyProvider: privateKeyProvider,
  });

  await web3auth.initModal();
  return web3auth;
};
