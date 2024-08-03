const { ethers } = require("hardhat");

async function main() {
  const EventManagement = await ethers.getContractFactory("EventManagement");
  const eventManagement = await EventManagement.deploy();
  // await eventManagement.deployed();

  console.log("EventManagement deployed to:", eventManagement, eventManagement.target);
  // deployed address(sepolia): 0x94d92F12598165389047320086B9640Eb2681fFf
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });