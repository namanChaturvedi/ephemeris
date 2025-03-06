// Chain IDs
export const CHAIN_IDS = {
  LOCALHOST: '0x539', // 1337 in decimal
  BSC_TESTNET: '0x61', // 97 in decimal
  BSC_MAINNET: '0x38', // 56 in decimal
  SEPOLIA: '0xaa36a7', // 11155111 in decimal
};

// Contract addresses
const CONTRACT_ADDRESSES = {
  // Local development
  [CHAIN_IDS.LOCALHOST]: {
    AstrologyNFT: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MatchingEngine: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    HoroscopeOracle: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
  // BSC Testnet
  [CHAIN_IDS.BSC_TESTNET]: {
    AstrologyNFT: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    MatchingEngine: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    HoroscopeOracle: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
  },
  // BSC Mainnet
  [CHAIN_IDS.BSC_MAINNET]: {
    AstrologyNFT: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    MatchingEngine: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    HoroscopeOracle: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
  },
  // Sepolia Testnet
  [CHAIN_IDS.SEPOLIA]: {
    AstrologyNFT: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    MatchingEngine: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
    HoroscopeOracle: '0x0000000000000000000000000000000000000000', // Replace with actual address after deployment
  },
};

// Network configurations for adding to MetaMask
export const NETWORKS = {
  localhost: {
    chainId: CHAIN_IDS.LOCALHOST,
    chainName: 'Localhost',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
  },
  bscTestnet: {
    chainId: CHAIN_IDS.BSC_TESTNET,
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
  bscMainnet: {
    chainId: CHAIN_IDS.BSC_MAINNET,
    chainName: 'BSC Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  sepolia: {
    chainId: CHAIN_IDS.SEPOLIA,
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
};

// Get contract addresses based on chain ID
export const getContractAddresses = (chainId) => {
  if (!chainId) return CONTRACT_ADDRESSES[CHAIN_IDS.LOCALHOST];
  
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[CHAIN_IDS.LOCALHOST];
};