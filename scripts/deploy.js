const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Check deployer's balance to ensure it has enough testnet ETH
  const balance = await deployer.getBalance();
  console.log("Deployer's balance:", hre.ethers.utils.formatEther(balance), "ETH");

  if (balance.eq(0)) {
    throw new Error("Insufficient funds for deployment");
  }

  console.log("Deploying contracts with the account:", deployer.address);

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy();

  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
