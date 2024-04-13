import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("RentableToken", function () {
  async function deployTokenFixture() {
    const [owner, otherAccount1, otherAccount2, otherAccount3] = await ethers.getSigners();
    const date = (await time.latest())
    const RentableToken = await ethers.getContractFactory("RentableToken");
    const contract = await RentableToken.deploy();

    return { contract, owner, otherAccount1, otherAccount2, otherAccount3, date };
  }

  describe("Deployment", function () {
    it("Should set the owners balance", async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);

      expect(await contract.balanceOf(owner.address)).greaterThan(0);
    });

  });
  describe("BalanceOf", function () {
    it("Should correctly update balance when tokens are transferred", async function () {
      const { contract, otherAccount1 } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 1000);

      expect(await contract.balanceOf(otherAccount1.address)).is.equal(1000);
    });
    it("Should handle balance of multiple transfers correctly", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 500);
      await contract.transfer(otherAccount2.address, 250);

      expect(await contract.balanceOf(otherAccount1.address)).to.be.equal(500);
      expect(await contract.balanceOf(otherAccount2.address)).to.be.equal(250);
      expect(await contract.balanceOf(otherAccount1.address)).to.be.equal(500);
    });


  })
  describe("BalanceOfInterval", function () {
    it("Should correctly update balance when tokens are transferred", async function () {
      const { contract, otherAccount1, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 1000);

      expect(await contract.balanceOfInterval(otherAccount1.address, date, date + 24 * 60 * 60)).is.equal(1000);
    })
    it("Should correctly update interval balance when tokens are rented", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);


      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);

      expect(await contract.balanceOfInterval(otherAccount1.address, date, date + 24 * 60 * 60)).is.equal(900);
      expect(await contract.balanceOfInterval(otherAccount2.address, date, date + 24 * 60 * 60)).is.equal(100);

    })
    it("Should correctly update excluding interval balance when tokens are rented", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);


      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);

      expect(await contract.balanceOfInterval(otherAccount1.address, date - 24 * 60 * 60, date + 24 * 60 * 60)).is.equal(900);
      expect(await contract.balanceOfInterval(otherAccount1.address, date - 24 * 60 * 60, date - 23 * 60 * 60)).is.equal(1000);
      expect(await contract.balanceOfInterval(otherAccount2.address, date, date + 24 * 60 * 60 * 2)).is.equal(0);

    })

  })

  describe("Rent", function () {

    it("Should correctly update balance of the renter when tokens are rented", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);


      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);

      const rentedTokens = await contract.connect(otherAccount1).getRentedTokens();

      expect(rentedTokens[0].account).is.equal(otherAccount2.address);
      expect(rentedTokens[0].amount).is.equal(100);
      expect(rentedTokens[0].startDate).is.equal(date);
      expect(rentedTokens[0].endDate).is.equal(date + 24 * 60 * 60);

      expect(await contract.balanceOf(otherAccount1.address)).is.equal(900);
      expect(await contract.balanceOf(otherAccount2.address)).is.equal(100);

    })

    it("Should correctly update balance of the renter when tokens are returned", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);
      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);
      time.increaseTo(date + 24 * 60 * 60 * 2);
      const rentedTokens = await contract.connect(otherAccount1).getRentedTokens();

      const nodeId = rentedTokens[0].nodeId;
      expect(await contract.connect(otherAccount1).reclaimRentedToken(nodeId)).to.emit(contract, "ReclaimRentedToken").withArgs(otherAccount1, 100);

      expect(await contract.balanceOf(otherAccount1.address)).is.equal(1000);
      expect(await contract.balanceOf(otherAccount2.address)).is.equal(0);
      const rentedTokens2 = await contract.connect(otherAccount2).getRentedTokens();

      expect(rentedTokens2.length).is.equal(0);


    });
    it("Should not allow renting more tokens than available balance", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 100);

      await expect(contract.connect(otherAccount1).rent(otherAccount2.address, 200, date, date + 24 * 60 * 60))
        .to.be.revertedWith("Renting amount exceeds the balance");
    });

    it("Should not allow renting more tokens than MAX_NO_RENTINGS", async function () {

      const { contract, otherAccount1, otherAccount2, otherAccount3, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 2000);
      await contract.transfer(otherAccount2.address, 1000);
      await contract.transfer(otherAccount3.address, 1000);


      for (let i = 0; i < 1000; i++) {
        await contract.connect(otherAccount1).rent(otherAccount2.address, 1, date, date + 24 * 60 * 60);
      }

      await expect(contract.connect(otherAccount1).rent(otherAccount2.address, 1, date, date + 24 * 60 * 60))
        .to.be.revertedWith("Maximum number of renting is reached.");
    }).timeout(1);


  });
  describe("ReturnBorrowedToken", function () {
    it("Should allow returning tokens and update balances accordingly", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);

      time.increaseTo(date + 24 * 60 * 60 * 2);
      const rentedTokens = await contract.connect(otherAccount1).getRentedTokens();
      const nodeId = rentedTokens[0].nodeId;
      expect(await contract.connect(otherAccount1).reclaimRentedToken(nodeId)).to.emit(contract, "ReclaimRentedToken").withArgs(otherAccount1, 100);

      expect(await contract.balanceOf(otherAccount1.address)).to.be.equal(1000);
      expect(await contract.balanceOf(otherAccount2.address)).to.be.equal(0);

      const rentedTokens2 = await contract.connect(otherAccount1).getRentedTokens();

      expect(rentedTokens2.length).to.be.equal(0);
    });

    it("Should not allow returning tokens before end date", async function () {
      const { contract, otherAccount1, otherAccount2, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 100, date, date + 24 * 60 * 60);

      const tokens = await contract.connect(otherAccount1).getRentedTokens();
      const nodeId = tokens[0].nodeId;
      await expect(contract.connect(otherAccount1).reclaimRentedToken(nodeId))
        .to.be.revertedWith("Token cannot be returned yet");
    });

    it("Should handle returning of multiple tokens correctly", async function () {
      const { contract, otherAccount1, otherAccount2, otherAccount3, date } = await loadFixture(deployTokenFixture);

      await contract.transfer(otherAccount1.address, 1000);
      await contract.connect(otherAccount1).rent(otherAccount2.address, 200, date, date + 24 * 60 * 60);
      await contract.connect(otherAccount1).rent(otherAccount3.address, 300, date, date + 24 * 60 * 60);

      time.increaseTo(date + 24 * 60 * 60 * 2);
      const rentedTokens = await contract.connect(otherAccount1).getRentedTokens();
      const nodeId1 = rentedTokens[0].nodeId;
      const nodeId2 = rentedTokens[1].nodeId;

      await contract.connect(otherAccount1).reclaimRentedToken(nodeId1);
      await contract.connect(otherAccount1).reclaimRentedToken(nodeId2);

      expect(await contract.balanceOf(otherAccount1.address)).to.be.equal(1000);
      expect(await contract.balanceOf(otherAccount2.address)).to.be.equal(0);
      expect(await contract.balanceOf(otherAccount3.address)).to.be.equal(0);
    });

  });


})
