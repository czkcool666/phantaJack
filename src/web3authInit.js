// src/web3authInit.js
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

const chainConfig = {
  chainId: "0xaa36a7", // Sepolia testnet
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
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

// Singleton instances
let web3authInstance = null;
let walletServicesPluginInstance = null;

export const initializeWeb3Auth = async () => {
  if (web3authInstance !== null && walletServicesPluginInstance!==null) {
    return { web3auth: web3authInstance, walletServicesPlugin: walletServicesPluginInstance };
  }

  try {
    // Initialize Web3Auth
    const web3auth = new Web3Auth({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      privateKeyProvider: privateKeyProvider,
    });

    // Initialize WalletServicesPlugin
    const walletServicesPlugin = new WalletServicesPlugin({
      wsEmbedOpts: {},
      walletInitOptions: {
        whiteLabel: {
          logoDark: "https://images.toruswallet.io/eth.svg",
          logoLight: "https://images.toruswallet.io/eth.svg",
        },
        showWidgetButton: true 
      },
    });

    await web3auth.addPlugin(walletServicesPlugin);

    // Initialize MetaMask Adapter
    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      sessionTime: 3600, // 1 hour
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0xaa36a7",
        rpcTarget: "https://rpc.ankr.com/eth_sepolia",
      },
    });

    // Add MetaMask adapter to Web3Auth
    web3auth.configureAdapter(metamaskAdapter);

    // Initialize Web3Auth modal
    await web3auth.initModal();

    console.log("Web3Auth, WalletServicesPlugin, and MetaMask Adapter initialized successfully.");

    // Store instances
    web3authInstance = web3auth;
    walletServicesPluginInstance = walletServicesPlugin;

    return { web3auth, walletServicesPlugin };
  } catch (error) {
    console.error("Error initializing Web3Auth or WalletServicesPlugin:", error);
    throw error;
  }
};
