import { ethers } from "hardhat";

async function main() {
  const MyRentableContract = await ethers.getContractFactory("RentableContractFactory");
  const myRentableContract = await MyRentableContract.deploy();

  await myRentableContract.waitForDeployment();

  console.log("The Contract deployed to:", await myRentableContract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
