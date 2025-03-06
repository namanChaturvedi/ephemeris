import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../context/WalletContext';

/**
 * Custom hook for handling web3 interactions
 * @param {string} contractAddress - Contract address
 * @param {Array} contractAbi - Contract ABI
 * @returns {Object} Contract instance and utility functions
 */
const useWeb3 = (contractAddress, contractAbi) => {
  const { provider, account, chainId } = useContext(WalletContext);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize contract instance
  useEffect(() => {
    if (provider && contractAddress && contractAbi) {
      try {
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError('Failed to initialize contract');
        setContract(null);
      }
    } else {
      setContract(null);
    }
  }, [provider, contractAddress, contractAbi]);
  
  /**
   * Call a read-only contract method
   * @param {string} method - Contract method name
   * @param {Array} args - Method arguments
   * @returns {Promise} Promise resolving to the method result
   */
  const call = async (method, ...args) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await contract[method](...args);
      return result;
    } catch (err) {
      console.error(`Error calling ${method}:`, err);
      setError(`Failed to call ${method}: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Send a transaction to the contract
   * @param {string} method - Contract method name
   * @param {Array} args - Method arguments
   * @param {Object} options - Transaction options (value, gasLimit, etc.)
   * @returns {Promise} Promise resolving to the transaction receipt
   */
  const send = async (method, args = [], options = {}) => {
    if (!contract || !provider) {
      throw new Error('Contract or provider not initialized');
    }
    
    if (!account) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner[method](...args, options);
      const receipt = await tx.wait();
      
      return receipt;
    } catch (err) {
      console.error(`Error sending ${method}:`, err);
      setError(`Failed to send ${method}: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Listen for contract events
   * @param {string} eventName - Event name
   * @param {Function} callback - Event callback
   * @returns {Function} Function to remove the listener
   */
  const listenForEvents = (eventName, callback) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    contract.on(eventName, callback);
    
    return () => {
      contract.off(eventName, callback);
    };
  };
  
  return {
    contract,
    call,
    send,
    listenForEvents,
    isLoading,
    error
  };
};

export default useWeb3; 