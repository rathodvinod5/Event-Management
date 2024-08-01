const { ethers } = require("hardhat");

async function main() {
  const EventManagement = await ethers.getContractFactory("EventManagement");
  const eventManagement = await EventManagement.deploy();
  // await eventManagement.deployed();

  console.log("EventManagement deployed to:", eventManagement, eventManagement.target);
  // address: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });