import { ethers } from "hardhat";

async function main() {
  const MyRentableContract1 = await ethers.getContractFactory("RentableERC20ContractFactory");
  const myRentableContract1 = await MyRentableContract1.deploy();

  await myRentableContract1.waitForDeployment();

  console.log("The ERC20 Factory Contract deployed to:", await myRentableContract1.getAddress());

  const MyRentableContract2 = await ethers.getContractFactory("RentableERC721ContractFactory");
  const myRentableContract2 = await MyRentableContract2.deploy();

  await myRentableContract2.waitForDeployment();

  console.log("The ERC721Factory Contract deployed to:", await myRentableContract2.getAddress());

  const MyRentableContract3 = await ethers.getContractFactory("RentableERC1155ContractFactory");
  const myRentableContract3 = await MyRentableContract3.deploy();

  await myRentableContract3.waitForDeployment();

  console.log("The ERC1155 Factory Contract deployed to:", await myRentableContract3.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
