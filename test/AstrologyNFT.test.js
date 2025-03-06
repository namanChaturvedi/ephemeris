const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstrologyNFT", function () {
  let AstrologyNFT;
  let astrologyNFT;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the AstrologyNFT contract
    AstrologyNFT = await ethers.getContractFactory("AstrologyNFT");
    astrologyNFT = await AstrologyNFT.deploy("Ephemeris Horoscope", "EPHM", owner.address);
    await astrologyNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await astrologyNFT.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await astrologyNFT.name()).to.equal("Ephemeris Horoscope");
      expect(await astrologyNFT.symbol()).to.equal("EPHM");
    });
  });

  describe("Minting", function () {
    it("Should mint a new horoscope NFT", async function () {
      // Create test data
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const encryptedData = ethers.toUtf8Bytes("encrypted test data");
      const allowDataSharing = true;

      // Mint the NFT
      await astrologyNFT.connect(user1).mintHoroscope(dataHash, encryptedData, allowDataSharing);

      // Check that the NFT was minted correctly
      expect(await astrologyNFT.balanceOf(user1.address)).to.equal(1);
      expect(await astrologyNFT.ownerOf(0)).to.equal(user1.address);
      expect(await astrologyNFT.isDataSharingAllowed(0)).to.equal(allowDataSharing);
    });

    it("Should emit HoroscopeMinted event", async function () {
      // Create test data
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const encryptedData = ethers.toUtf8Bytes("encrypted test data");
      const allowDataSharing = true;

      // Mint the NFT and check for the event
      await expect(astrologyNFT.connect(user1).mintHoroscope(dataHash, encryptedData, allowDataSharing))
        .to.emit(astrologyNFT, "HoroscopeMinted")
        .withArgs(user1.address, 0, dataHash);
    });

    it("Should reject minting with empty data hash", async function () {
      const emptyHash = ethers.ZeroHash;
      const encryptedData = ethers.toUtf8Bytes("encrypted test data");
      const allowDataSharing = true;

      await expect(
        astrologyNFT.connect(user1).mintHoroscope(emptyHash, encryptedData, allowDataSharing)
      ).to.be.revertedWith("Data hash cannot be empty");
    });

    it("Should reject minting with empty encrypted data", async function () {
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const emptyData = ethers.toUtf8Bytes("");
      const allowDataSharing = true;

      await expect(
        astrologyNFT.connect(user1).mintHoroscope(dataHash, emptyData, allowDataSharing)
      ).to.be.revertedWith("Encrypted data cannot be empty");
    });
  });

  describe("Data Sharing", function () {
    beforeEach(async function () {
      // Mint an NFT for testing
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const encryptedData = ethers.toUtf8Bytes("encrypted test data");
      const allowDataSharing = true;

      await astrologyNFT.connect(user1).mintHoroscope(dataHash, encryptedData, allowDataSharing);
    });

    it("Should allow the owner to update data sharing preferences", async function () {
      // Update data sharing to false
      await astrologyNFT.connect(user1).updateDataSharing(0, false);
      expect(await astrologyNFT.isDataSharingAllowed(0)).to.equal(false);

      // Update data sharing back to true
      await astrologyNFT.connect(user1).updateDataSharing(0, true);
      expect(await astrologyNFT.isDataSharingAllowed(0)).to.equal(true);
    });

    it("Should emit DataSharingUpdated event", async function () {
      await expect(astrologyNFT.connect(user1).updateDataSharing(0, false))
        .to.emit(astrologyNFT, "DataSharingUpdated")
        .withArgs(user1.address, 0, false);
    });

    it("Should reject data sharing updates from non-owners", async function () {
      await expect(
        astrologyNFT.connect(user2).updateDataSharing(0, false)
      ).to.be.revertedWith("Not the owner of the token");
    });
  });

  describe("Data Access", function () {
    beforeEach(async function () {
      // Mint an NFT for testing
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
      const encryptedData = ethers.toUtf8Bytes("encrypted test data");
      const allowDataSharing = true;

      await astrologyNFT.connect(user1).mintHoroscope(dataHash, encryptedData, allowDataSharing);
    });

    it("Should allow the owner to access encrypted data", async function () {
      const data = await astrologyNFT.connect(user1).getEncryptedData(0);
      expect(ethers.toUtf8String(data)).to.equal("encrypted test data");
    });

    it("Should allow the contract owner to access data if sharing is enabled", async function () {
      const data = await astrologyNFT.connect(owner).getEncryptedData(0);
      expect(ethers.toUtf8String(data)).to.equal("encrypted test data");
    });

    it("Should reject data access from unauthorized users", async function () {
      await expect(
        astrologyNFT.connect(user2).getEncryptedData(0)
      ).to.be.revertedWith("Not authorized to access data");
    });

    it("Should reject data access from contract owner if sharing is disabled", async function () {
      // Disable data sharing
      await astrologyNFT.connect(user1).updateDataSharing(0, false);

      await expect(
        astrologyNFT.connect(owner).getEncryptedData(0)
      ).to.be.revertedWith("Not authorized to access data");
    });
  });
});