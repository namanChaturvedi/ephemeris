import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { CHAIN_IDS } from '../utils/contracts';

const NetworkSelector = () => {
  const { chainId, switchNetwork } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getNetworkName = () => {
    switch (chainId) {
      case CHAIN_IDS.BSC_MAINNET:
        return 'BSC Mainnet';
      case CHAIN_IDS.BSC_TESTNET:
        return 'BSC Testnet';
      case CHAIN_IDS.LOCALHOST:
        return 'Localhost';
      case CHAIN_IDS.SEPOLIA:
        return 'Sepolia';
      default:
        return 'Unknown Network';
    }
  };
  
  const getNetworkColor = () => {
    switch (chainId) {
      case CHAIN_IDS.BSC_MAINNET:
        return 'bg-yellow-500';
      case CHAIN_IDS.BSC_TESTNET:
        return 'bg-yellow-300';
      case CHAIN_IDS.LOCALHOST:
        return 'bg-gray-500';
      case CHAIN_IDS.SEPOLIA:
        return 'bg-blue-400';
      default:
        return 'bg-red-500';
    }
  };
  
  const handleNetworkSwitch = (targetChainId) => {
    switchNetwork(targetChainId);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        <div className={`w-3 h-3 rounded-full ${getNetworkColor()}`}></div>
        <span>{getNetworkName()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleNetworkSwitch(CHAIN_IDS.LOCALHOST)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span>Localhost</span>
              </div>
            </button>
            <button
              onClick={() => handleNetworkSwitch(CHAIN_IDS.BSC_TESTNET)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-300 mr-2"></div>
                <span>BSC Testnet</span>
              </div>
            </button>
            <button
              onClick={() => handleNetworkSwitch(CHAIN_IDS.BSC_MAINNET)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>BSC Mainnet</span>
              </div>
            </button>
            <button
              onClick={() => handleNetworkSwitch(CHAIN_IDS.SEPOLIA)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span>Sepolia</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;