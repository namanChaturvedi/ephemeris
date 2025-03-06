import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CHAIN_IDS, NETWORKS } from '../utils/contracts';

// Create context
const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log('Make sure you have MetaMask installed!');
        return;
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
        setChainId(chainId);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking if wallet is connected:', error);
      setError('Failed to connect to wallet');
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to use this app');
        setIsConnecting(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      setAccount(accounts[0]);
      setChainId(chainId);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Failed to connect to wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
  };

  const switchToNetwork = async (networkName) => {
    if (!window.ethereum) return;
    
    const network = NETWORKS[networkName];
    if (!network) {
      console.error(`Network ${networkName} not found`);
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } catch (addError) {
          console.error(`Error adding ${networkName} to MetaMask:`, addError);
        }
      }
    }
  };

  const switchToBscTestnet = async () => {
    await switchToNetwork('bscTestnet');
  };

  const switchToSepolia = async () => {
    await switchToNetwork('sepolia');
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User has disconnected their wallet
      disconnectWallet();
    } else {
      // User has switched accounts
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = async (chainId) => {
    // Handle chain change
    setChainId(chainId);
    
    // Update provider and signer for the new chain
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      try {
        const signer = await provider.getSigner();
        setSigner(signer);
      } catch (error) {
        console.error('Error getting signer after chain change:', error);
      }
    }
  };

  const getNetworkName = () => {
    switch (chainId) {
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

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchToBscTestnet,
    switchToSepolia,
    getNetworkName,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};