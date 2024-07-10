const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const recipientAddress = "0xE25696E15dd5776F1410647e24c242385A39E973"; // Replace with your actual address

  // Estimate gas for deployment
  const estimatedGas = await hre.ethers.provider.estimateGas(
    MyNFT.getDeployTransaction(recipientAddress)
  );

  // Get the current gas price
  const gasPrice = await hre.ethers.provider.getGasPrice();

  // Calculate the deployment cost
  const deploymentCost = estimatedGas.mul(gasPrice);

  console.log("Estimated Gas: ", estimatedGas.toString());
  console.log("Gas Price: ", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("Deployment Cost: ", hre.ethers.utils.formatEther(deploymentCost), "ETH");

  console.log("Deployer's balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
