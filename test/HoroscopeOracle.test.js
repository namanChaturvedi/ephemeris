const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoroscopeOracle", function () {
  let AstrologyNFT;
  let astrologyNFT;
  let HoroscopeOracle;
  let horoscopeOracle;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the AstrologyNFT contract
    AstrologyNFT = await ethers.getContractFactory("AstrologyNFT");
    astrologyNFT = await AstrologyNFT.deploy("Ephemeris Horoscope", "EPHM", owner.address);
    await astrologyNFT.waitForDeployment();

    // Deploy the HoroscopeOracle contract
    HoroscopeOracle = await ethers.getContractFactory("HoroscopeOracle");
    horoscopeOracle = await HoroscopeOracle.deploy(await astrologyNFT.getAddress(), owner.address);
    await horoscopeOracle.waitForDeployment();

    // Mint some NFTs for testing
    // User 1 - Aries (0)
    await astrologyNFT.connect(user1).mintHoroscope(
      ethers.keccak256(ethers.toUtf8Bytes("user1")),
      ethers.concat([ethers.toUtf8Bytes([0]), ethers.toUtf8Bytes("user1 data")]),
      true
    );

    // User 2 - Taurus (1)
    await astrologyNFT.connect(user2).mintHoroscope(
      ethers.keccak256(ethers.toUtf8Bytes("user2")),
      ethers.concat([ethers.toUtf8Bytes([1]), ethers.toUtf8Bytes("user2 data")]),
      false
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await horoscopeOracle.owner()).to.equal(owner.address);
    });
  });

  describe("Weekly Horoscopes", function () {
    it("Should update weekly horoscopes", async function () {
      const zodiacSigns = [0, 1]; // Aries and Taurus
      const horoscopes = [
        ethers.toUtf8Bytes("Aries weekly horoscope"),
        ethers.toUtf8Bytes("Taurus weekly horoscope")
      ];

      await horoscopeOracle.connect(owner).updateWeeklyHoroscopes(zodiacSigns, horoscopes);

      // Check that the horoscopes were updated
      const ariesHoroscope = await horoscopeOracle.getWeeklyHoroscope(0);
      const taurusHoroscope = await horoscopeOracle.getWeeklyHoroscope(1);

      expect(ethers.toUtf8String(ariesHoroscope)).to.equal("Aries weekly horoscope");
      expect(ethers.toUtf8String(taurusHoroscope)).to.equal("Taurus weekly horoscope");
    });

    it("Should emit WeeklyHoroscopesUpdated event", async function () {
      const zodiacSigns = [0, 1];
      const horoscopes = [
        ethers.toUtf8Bytes("Aries weekly horoscope"),
        ethers.toUtf8Bytes("Taurus weekly horoscope")
      ];

      await expect(horoscopeOracle.connect(owner).updateWeeklyHoroscopes(zodiacSigns, horoscopes))
        .to.emit(horoscopeOracle, "WeeklyHoroscopesUpdated");
    });

    it("Should reject updates from non-owners", async function () {
      const zodiacSigns = [0, 1];
      const horoscopes = [
        ethers.toUtf8Bytes("Aries weekly horoscope"),
        ethers.toUtf8Bytes("Taurus weekly horoscope")
      ];

      await expect(
        horoscopeOracle.connect(user1).updateWeeklyHoroscopes(zodiacSigns, horoscopes)
      ).to.be.revertedWithCustomError(horoscopeOracle, "OwnableUnauthorizedAccount");
    });

    it("Should reject updates with mismatched array lengths", async function () {
      const zodiacSigns = [0, 1, 2]; // Three zodiac signs
      const horoscopes = [
        ethers.toUtf8Bytes("Aries weekly horoscope"),
        ethers.toUtf8Bytes("Taurus weekly horoscope")
      ]; // Only two horoscopes

      await expect(
        horoscopeOracle.connect(owner).updateWeeklyHoroscopes(zodiacSigns, horoscopes)
      ).to.be.revertedWith("Arrays must have the same length");
    });

    it("Should reject invalid zodiac sign indices", async function () {
      const zodiacSigns = [0, 12]; // 12 is invalid (0-11 are valid)
      const horoscopes = [
        ethers.toUtf8Bytes("Aries weekly horoscope"),
        ethers.toUtf8Bytes("Invalid horoscope")
      ];

      await expect(
        horoscopeOracle.connect(owner).updateWeeklyHoroscopes(zodiacSigns, horoscopes)
      ).to.be.revertedWith("Invalid zodiac sign index");
    });
  });

  describe("Auspicious Times", function () {
    it("Should update auspicious times", async function () {
      const tokenId = 0;
      const auspiciousTimes = ethers.toUtf8Bytes("Auspicious times for Aries");

      await horoscopeOracle.connect(owner).updateAuspiciousTimes(tokenId, auspiciousTimes);

      // Check that the auspicious times were updated
      const times = await horoscopeOracle.connect(user1).getAuspiciousTimes(tokenId);
      expect(ethers.toUtf8String(times)).to.equal("Auspicious times for Aries");
    });

    it("Should emit AuspiciousTimesUpdated event", async function () {
      const tokenId = 0;
      const auspiciousTimes = ethers.toUtf8Bytes("Auspicious times for Aries");

      await expect(horoscopeOracle.connect(owner).updateAuspiciousTimes(tokenId, auspiciousTimes))
        .to.emit(horoscopeOracle, "AuspiciousTimesUpdated");
    });

    it("Should reject updates from non-owners", async function () {
      const tokenId = 0;
      const auspiciousTimes = ethers.toUtf8Bytes("Auspicious times for Aries");

      await expect(
        horoscopeOracle.connect(user1).updateAuspiciousTimes(tokenId, auspiciousTimes)
      ).to.be.revertedWithCustomError(horoscopeOracle, "OwnableUnauthorizedAccount");
    });

    it("Should reject updates for non-existent tokens", async function () {
      const tokenId = 999; // Non-existent token
      const auspiciousTimes = ethers.toUtf8Bytes("Auspicious times for non-existent token");

      await expect(
        horoscopeOracle.connect(owner).updateAuspiciousTimes(tokenId, auspiciousTimes)
      ).to.be.reverted;
    });
  });

  describe("Data Access", function () {
    beforeEach(async function () {
      // Update auspicious times for both tokens
      await horoscopeOracle.connect(owner).updateAuspiciousTimes(
        0,
        ethers.toUtf8Bytes("Auspicious times for Aries")
      );
      await horoscopeOracle.connect(owner).updateAuspiciousTimes(
        1,
        ethers.toUtf8Bytes("Auspicious times for Taurus")
      );
    });

    it("Should allow token owners to access their auspicious times", async function () {
      const times = await horoscopeOracle.connect(user1).getAuspiciousTimes(0);
      expect(ethers.toUtf8String(times)).to.equal("Auspicious times for Aries");
    });

    it("Should allow contract owner to access auspicious times if data sharing is enabled", async function () {
      const times = await horoscopeOracle.connect(owner).getAuspiciousTimes(0);
      expect(ethers.toUtf8String(times)).to.equal("Auspicious times for Aries");
    });

    it("Should reject access from unauthorized users", async function () {
      await expect(
        horoscopeOracle.connect(user2).getAuspiciousTimes(0)
      ).to.be.revertedWith("Not authorized to access data");
    });

    it("Should reject access from contract owner if data sharing is disabled", async function () {
      await expect(
        horoscopeOracle.connect(owner).getAuspiciousTimes(1)
      ).to.be.revertedWith("Not authorized to access data");
    });

    it("Should get zodiac sign for a token", async function () {
      const zodiacSign = await horoscopeOracle.getZodiacSign(0);
      expect(zodiacSign).to.equal(0); // Aries
    });
  });
});