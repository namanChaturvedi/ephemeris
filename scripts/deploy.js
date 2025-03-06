// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy AstrologyNFT
  const AstrologyNFT = await hre.ethers.getContractFactory("AstrologyNFT");
  const astrologyNFT = await AstrologyNFT.deploy("Ephemeris Horoscope", "EPHM", deployer.address);
  await astrologyNFT.waitForDeployment();
  const astrologyNFTAddress = await astrologyNFT.getAddress();
  console.log("AstrologyNFT deployed to:", astrologyNFTAddress);

  // Deploy MatchingEngine
  const MatchingEngine = await hre.ethers.getContractFactory("MatchingEngine");
  const matchingEngine = await MatchingEngine.deploy(astrologyNFTAddress, deployer.address);
  await matchingEngine.waitForDeployment();
  const matchingEngineAddress = await matchingEngine.getAddress();
  console.log("MatchingEngine deployed to:", matchingEngineAddress);

  // Deploy HoroscopeOracle
  const HoroscopeOracle = await hre.ethers.getContractFactory("HoroscopeOracle");
  const horoscopeOracle = await HoroscopeOracle.deploy(astrologyNFTAddress, deployer.address);
  await horoscopeOracle.waitForDeployment();
  const horoscopeOracleAddress = await horoscopeOracle.getAddress();
  console.log("HoroscopeOracle deployed to:", horoscopeOracleAddress);

  console.log("Deployment complete!");
  console.log("Contract Addresses:");
  console.log("AstrologyNFT:", astrologyNFTAddress);
  console.log("MatchingEngine:", matchingEngineAddress);
  console.log("HoroscopeOracle:", horoscopeOracleAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});