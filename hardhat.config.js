require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

// Replace with your actual API key and private key
const { METAMASK_PRIVATE_KEY } = process.env;
const MORALIS_NODE_API_KEY = "408370165b49454d81aac6b175eab24fa";

module.exports = {
  defaultNetwork: "sepolia",
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://speedy-nodes-nyc.moralis.io/${MORALIS_NODE_API_KEY}/eth/sepolia`,
      accounts: [METAMASK_PRIVATE_KEY],
      chainId: 11155111
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  }
};
