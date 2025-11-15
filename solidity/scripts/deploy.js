// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const InfraStorage = await hre.ethers.getContractFactory("InfraStorage");

  console.log("Deploying InfraStorage...");
  const infra = await InfraStorage.deploy();

  // čekamo da se deployment završi (ethers v6)
  await infra.waitForDeployment();

  const address = await infra.getAddress();
  console.log("InfraStorage deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
