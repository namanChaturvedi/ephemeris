require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key";
const BNB_TESTNET_URL = process.env.BNB_TESTNET_URL || "https://data-seed-prebsc-1-s1.binance.org:8545";
const BNB_MAINNET_URL = process.env.BNB_MAINNET_URL || "https://bsc-dataseed.binance.org/";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
  private: {
    url: "http://127.0.0.1:8545",
    accounts: {
      mnemonic: "test test test test test test test test test test test junk", // DO NOT use in production
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 10
    },
    chainId: 1337,
    saveDeployments: true
  },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    bnbTestnet: {
      url: BNB_TESTNET_URL,
      accounts: [PRIVATE_KEY],
      chainId: 97,
    },
    bnbMainnet: {
      url: BNB_MAINNET_URL,
      accounts: [PRIVATE_KEY],
      chainId: 56,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
};