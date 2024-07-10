require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY } = process.env;

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: ALCHEMY_API_URL,
      accounts: [METAMASK_PRIVATE_KEY]
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
