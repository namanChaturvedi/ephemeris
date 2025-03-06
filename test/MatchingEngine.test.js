const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MatchingEngine", function () {
  let AstrologyNFT;
  let astrologyNFT;
  let MatchingEngine;
  let matchingEngine;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy the AstrologyNFT contract
    AstrologyNFT = await ethers.getContractFactory("AstrologyNFT");
    astrologyNFT = await AstrologyNFT.deploy("Ephemeris Horoscope", "EPHM", owner.address);
    await astrologyNFT.waitForDeployment();

    // Deploy the MatchingEngine contract
    MatchingEngine = await ethers.getContractFactory("MatchingEngine");
    matchingEngine = await MatchingEngine.deploy(await astrologyNFT.getAddress(), owner.address);
    await matchingEngine.waitForDeployment();

    // Mint some NFTs for testing
    // User 1 - Aries (0)
    await astrologyNFT.connect(user1).mintHoroscope(
      ethers.keccak256(ethers.toUtf8Bytes("user1")),
      ethers.concat([ethers.toUtf8Bytes([0]), ethers.toUtf8Bytes("user1 data")]),
      true
    );

    // User 2 - Libra (6)
    await astrologyNFT.connect(user2).mintHoroscope(
      ethers.keccak256(ethers.toUtf8Bytes("user2")),
      ethers.concat([ethers.toUtf8Bytes([6]), ethers.toUtf8Bytes("user2 data")]),
      true
    );

    // User 3 - Gemini (2)
    await astrologyNFT.connect(user3).mintHoroscope(
      ethers.keccak256(ethers.toUtf8Bytes("user3")),
      ethers.concat([ethers.toUtf8Bytes([2]), ethers.toUtf8Bytes("user3 data")]),
      true
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await matchingEngine.owner()).to.equal(owner.address);
    });
  });

  describe("Match Requests", function () {
    it("Should create a match request", async function () {
      await matchingEngine.connect(user1).createMatchRequest(0);
      
      // Check that the match request was created by getting potential matches
      const matches = await matchingEngine.connect(user2).getPotentialMatches(1, 10);
      expect(matches.length).to.equal(1);
      expect(matches[0].tokenId).to.equal(0);
      expect(matches[0].user).to.equal(user1.address);
    });

    it("Should emit MatchRequestCreated event", async function () {
      await expect(matchingEngine.connect(user1).createMatchRequest(0))
        .to.emit(matchingEngine, "MatchRequestCreated")
        .withArgs(user1.address, 0);
    });

    it("Should reject match requests from non-owners", async function () {
      await expect(
        matchingEngine.connect(user2).createMatchRequest(0)
      ).to.be.revertedWith("Not the owner of the token");
    });

    it("Should reject match requests if data sharing is disabled", async function () {
      // Disable data sharing for user1's NFT
      await astrologyNFT.connect(user1).updateDataSharing(0, false);

      await expect(
        matchingEngine.connect(user1).createMatchRequest(0)
      ).to.be.revertedWith("Data sharing not allowed for this token");
    });

    it("Should cancel a match request", async function () {
      // Create a match request
      await matchingEngine.connect(user1).createMatchRequest(0);
      
      // Cancel the match request
      await matchingEngine.connect(user1).cancelMatchRequest(0);
      
      // Check that the match request was canceled by getting potential matches
      const matches = await matchingEngine.connect(user2).getPotentialMatches(1, 10);
      expect(matches.length).to.equal(0);
    });

    it("Should reject cancellation from non-owners", async function () {
      // Create a match request
      await matchingEngine.connect(user1).createMatchRequest(0);
      
      await expect(
        matchingEngine.connect(user2).cancelMatchRequest(0)
      ).to.be.revertedWith("Not the owner of the token");
    });
  });

  describe("Matching", function () {
    beforeEach(async function () {
      // Create match requests for all users
      await matchingEngine.connect(user1).createMatchRequest(0);
      await matchingEngine.connect(user2).createMatchRequest(1);
      await matchingEngine.connect(user3).createMatchRequest(2);
    });

    it("Should get potential matches", async function () {
      const matches = await matchingEngine.connect(user1).getPotentialMatches(0, 10);
      expect(matches.length).to.equal(2);
      
      // Check that the matches include user2 and user3's tokens
      const tokenIds = matches.map(match => Number(match.tokenId));
      expect(tokenIds).to.include(1);
      expect(tokenIds).to.include(2);
    });

    it("Should limit the number of matches returned", async function () {
      const matches = await matchingEngine.connect(user1).getPotentialMatches(0, 1);
      expect(matches.length).to.equal(1);
    });

    it("Should calculate compatibility scores", async function () {
      // Calculate compatibility between Aries (0) and Libra (6)
      const score1 = await matchingEngine.calculateCompatibility(0, 1);
      
      // Calculate compatibility between Aries (0) and Gemini (2)
      const score2 = await matchingEngine.calculateCompatibility(0, 2);
      
      // Scores should be different based on zodiac sign compatibility
      expect(score1).to.not.equal(score2);
    });

    it("Should reject potential matches request from non-owners", async function () {
      await expect(
        matchingEngine.connect(user2).getPotentialMatches(0, 10)
      ).to.be.revertedWith("Not the owner of the token");
    });
  });
});