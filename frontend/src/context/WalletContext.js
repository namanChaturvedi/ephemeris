import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CHAIN_IDS, NETWORKS } from '../utils/contracts';

// Create context
export const WalletContext = createContext();

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      // Check if window.ethereum is available
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setIsConnected(true);
            
            // Get network
            const network = await web3Provider.getNetwork();
            setChainId('0x' + network.chainId.toString(16));
          }
        } catch (err) {
          console.error('Error initializing provider:', err);
          setError('Failed to initialize wallet connection');
        }
      } else {
        setError('No Ethereum wallet detected. Please install MetaMask or another wallet.');
      }
    };
    
    initProvider();
  }, []);
  
  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setAccount(null);
        setIsConnected(false);
      } else {
        // Account changed
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };
    
    const handleChainChanged = (chainIdHex) => {
      setChainId(chainIdHex);
      window.location.reload(); // Recommended by MetaMask
    };
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);
  
  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet detected. Please install MetaMask or another wallet.');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // Get network
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      setChainId('0x' + network.chainId.toString(16));
      setProvider(web3Provider);
      
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    }
  };
  
  // Disconnect wallet (for UI purposes only, doesn't actually disconnect the wallet)
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };
  
  // Switch network
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) {
      setError('No Ethereum wallet detected');
      return;
    }
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const network = NETWORKS[Object.keys(CHAIN_IDS).find(key => CHAIN_IDS[key] === targetChainId)];
          
          if (!network) {
            throw new Error('Network configuration not found');
          }
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: network.chainId,
                chainName: network.chainName,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: network.rpcUrls,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add network to wallet');
        }
      } else {
        console.error('Error switching network:', switchError);
        setError('Failed to switch network');
      }
    }
  };
  
  return (
    <WalletContext.Provider
      value={{
        provider,
        account,
        chainId,
        isConnected,
        error,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};