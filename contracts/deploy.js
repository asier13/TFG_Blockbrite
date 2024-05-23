const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const accountBalance = await deployer.provider.getBalance(deployer.address); 

  console.log("Account balance:", accountBalance.toString());

  const Blockbrite = await ethers.getContractFactory("Blockbrite");
  const blockb = await Blockbrite.deploy();
  await blockb.waitForDeployment()

  console.log("MyNFT contract deployed to:", blockb.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
