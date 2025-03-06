import { ethers } from 'ethers';
import { getContractAddresses } from './contracts';

// Import ABIs
import AstrologyNFTAbi from '../abis/AstrologyNFT.json';
import MatchingEngineAbi from '../abis/MatchingEngine.json';
import HoroscopeOracleAbi from '../abis/HoroscopeOracle.json';

/**
 * Get AstrologyNFT contract instance
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @returns {ethers.Contract} Contract instance
 */
export const getAstrologyNFTContract = (providerOrSigner, chainId) => {
  const addresses = getContractAddresses(chainId);
  return new ethers.Contract(addresses.AstrologyNFT, AstrologyNFTAbi, providerOrSigner);
};

/**
 * Get MatchingEngine contract instance
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @returns {ethers.Contract} Contract instance
 */
export const getMatchingEngineContract = (providerOrSigner, chainId) => {
  const addresses = getContractAddresses(chainId);
  return new ethers.Contract(addresses.MatchingEngine, MatchingEngineAbi, providerOrSigner);
};

/**
 * Get HoroscopeOracle contract instance
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @returns {ethers.Contract} Contract instance
 */
export const getHoroscopeOracleContract = (providerOrSigner, chainId) => {
  const addresses = getContractAddresses(chainId);
  return new ethers.Contract(addresses.HoroscopeOracle, HoroscopeOracleAbi, providerOrSigner);
};

/**
 * Mint a horoscope NFT
 * @param {ethers.Signer} signer - Signer
 * @param {string} chainId - Chain ID
 * @param {string} dataHash - Hash of the encrypted data
 * @param {string} encryptedData - Encrypted birth data
 * @param {boolean} allowDataSharing - Whether to allow data sharing
 * @returns {Promise<Object>} Result object with success flag and data
 */
export const mintHoroscope = async (signer, chainId, dataHash, encryptedData, allowDataSharing) => {
  try {
    const contract = getAstrologyNFTContract(signer, chainId);
    
    // Mint the horoscope NFT
    const tx = await contract.mintHoroscope(dataHash, encryptedData, allowDataSharing);
    const receipt = await tx.wait();
    
    // Find the HoroscopeMinted event
    const event = receipt.logs
      .filter(log => log.topics[0] === ethers.id("HoroscopeMinted(address,uint256,bytes32)"))
      .map(log => {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        return {
          owner: parsedLog.args[0],
          tokenId: Number(parsedLog.args[1]),
          dataHash: parsedLog.args[2]
        };
      })[0];
    
    return {
      success: true,
      tokenId: event.tokenId,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error minting horoscope:', error);
    return {
      success: false,
      error: error.message || 'Failed to mint horoscope'
    };
  }
};

/**
 * Create a match request
 * @param {ethers.Signer} signer - Signer
 * @param {string} chainId - Chain ID
 * @param {number} tokenId - Token ID
 * @returns {Promise<Object>} Result object with success flag
 */
export const createMatchRequest = async (signer, chainId, tokenId) => {
  try {
    const contract = getMatchingEngineContract(signer, chainId);
    const tx = await contract.createMatchRequest(tokenId);
    await tx.wait();
    
    return { success: true };
  } catch (error) {
    console.error('Error creating match request:', error);
    return {
      success: false,
      error: error.message || 'Failed to create match request'
    };
  }
};

/**
 * Get potential matches
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @param {number} tokenId - Token ID
 * @param {number} limit - Maximum number of matches to return
 * @returns {Promise<Object>} Result object with success flag and matches
 */
export const getPotentialMatches = async (providerOrSigner, chainId, tokenId, limit) => {
  try {
    const contract = getMatchingEngineContract(providerOrSigner, chainId);
    const matches = await contract.getPotentialMatches(tokenId, limit);
    
    return {
      success: true,
      matches: matches.map(match => ({
        user: match.user,
        tokenId: match.tokenId,
        compatibilityScore: match.score,
        isActive: match.isActive
      }))
    };
  } catch (error) {
    console.error('Error getting potential matches:', error);
    return {
      success: false,
      error: error.message || 'Failed to get potential matches'
    };
  }
};

/**
 * Get weekly horoscope
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @param {number} zodiacSign - Zodiac sign index (0-11)
 * @returns {Promise<Object>} Result object with success flag and horoscope
 */
export const getWeeklyHoroscope = async (providerOrSigner, chainId, zodiacSign) => {
  try {
    const contract = getHoroscopeOracleContract(providerOrSigner, chainId);
    const encryptedHoroscope = await contract.getWeeklyHoroscope(zodiacSign);
    
    // In a real implementation, this would decrypt the horoscope data
    // For now, we'll return a mock horoscope
    const mockHoroscope = {
      timestamp: Math.floor(Date.now() / 1000),
      general: "You will have an interesting week ahead. Stay focused on your goals.",
      love: "Romance is in the air. Be open to new connections.",
      career: "A new opportunity may present itself at work. Be ready to seize it.",
      health: "Take care of your physical and mental well-being. Consider meditation.",
      luckyNumbers: [3, 7, 12, 21, 36, 42]
    };
    
    return {
      success: true,
      horoscope: mockHoroscope
    };
  } catch (error) {
    console.error('Error getting weekly horoscope:', error);
    return {
      success: false,
      error: error.message || 'Failed to get weekly horoscope'
    };
  }
};

/**
 * Get auspicious times
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @param {string} chainId - Chain ID
 * @param {number} tokenId - Token ID
 * @returns {Promise<Object>} Result object with success flag and auspicious times
 */
export const getAuspiciousTimes = async (providerOrSigner, chainId, tokenId) => {
  try {
    const contract = getHoroscopeOracleContract(providerOrSigner, chainId);
    const encryptedTimes = await contract.getAuspiciousTimes(tokenId);
    
    // In a real implementation, this would decrypt the auspicious times data
    // For now, we'll return mock data
    const now = Math.floor(Date.now() / 1000);
    const mockTimes = {
      timestamp: now,
      activities: [
        {
          name: "Travel",
          times: [
            { start: now + 3600, end: now + 7200 },
            { start: now + 86400, end: now + 93600 }
          ]
        },
        {
          name: "Business",
          times: [
            { start: now + 10800, end: now + 14400 },
            { start: now + 172800, end: now + 180000 }
          ]
        },
        {
          name: "Love",
          times: [
            { start: now + 21600, end: now + 25200 },
            { start: now + 259200, end: now + 266400 }
          ]
        }
      ],
      alignments: [
        "Jupiter is in a favorable position for financial decisions.",
        "Venus and Mars alignment suggests romantic opportunities.",
        "Mercury retrograde ends soon, improving communication."
      ]
    };
    
    return {
      success: true,
      times: mockTimes
    };
  } catch (error) {
    console.error('Error getting auspicious times:', error);
    return {
      success: false,
      error: error.message || 'Failed to get auspicious times'
    };
  }
};