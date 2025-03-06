import React from 'react';
import { useWallet } from '../context/WalletContext';
import { CHAIN_IDS } from '../utils/contracts';

const NetworkSelector = () => {
  const { chainId, switchToBscTestnet, switchToSepolia, isConnected } = useWallet();

  if (!isConnected) {
    return null;
  }

  const handleNetworkChange = (e) => {
    const network = e.target.value;
    if (network === 'bscTestnet') {
      switchToBscTestnet();
    } else if (network === 'sepolia') {
      switchToSepolia();
    }
  };

  const getNetworkName = (networkId) => {
    switch (networkId) {
      case CHAIN_IDS.BSC_MAINNET:
        return 'BSC Mainnet';
      case CHAIN_IDS.BSC_TESTNET:
        return 'BSC Testnet';
      case CHAIN_IDS.LOCALHOST:
        return 'Localhost';
      case CHAIN_IDS.SEPOLIA:
        return 'Sepolia Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const getNetworkColor = (networkId) => {
    switch (networkId) {
      case CHAIN_IDS.BSC_MAINNET:
        return 'bg-yellow-600';
      case CHAIN_IDS.BSC_TESTNET:
        return 'bg-yellow-500';
      case CHAIN_IDS.LOCALHOST:
        return 'bg-gray-500';
      case CHAIN_IDS.SEPOLIA:
        return 'bg-blue-500';
      default:
        return 'bg-red-500';
    }
  };

  const getCurrentValue = () => {
    if (chainId === CHAIN_IDS.BSC_TESTNET) return 'bscTestnet';
    if (chainId === CHAIN_IDS.SEPOLIA) return 'sepolia';
    return '';
  };

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${getNetworkColor(chainId)}`}></div>
      <select
        value={getCurrentValue()}
        onChange={handleNetworkChange}
        className="bg-indigo-700 bg-opacity-50 border border-indigo-600 rounded-md py-1 px-2 text-sm text-white"
      >
        <option value="" disabled>
          {getNetworkName(chainId)}
        </option>
        <option value="bscTestnet">Switch to BSC Testnet</option>
        <option value="sepolia">Switch to Sepolia Testnet</option>
      </select>
    </div>
  );
};

export default NetworkSelector;