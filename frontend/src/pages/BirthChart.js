import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { WalletContext } from '../context/WalletContext';
import { mintHoroscope } from '../utils/contractHelpers';
import { CHAIN_IDS } from '../utils/contracts';

const BirthChart = () => {
  const { account, chainId, provider } = useContext(WalletContext);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    allowDataSharing: false
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenId, setTokenId] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace || !formData.gender) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Convert birth date and time to timestamp
      const birthDateTime = new Date(`${formData.birthDate}T${formData.birthTime}`);
      const timestamp = Math.floor(birthDateTime.getTime() / 1000);
      
      // Mock latitude and longitude for birth location
      // In a real app, you would use a geocoding API
      const latitude = 40.7128; // Example: New York
      const longitude = -74.0060;
      
      // Convert gender to number (0 = male, 1 = female, 2 = other)
      const genderCode = formData.gender === 'male' ? 0 : formData.gender === 'female' ? 1 : 2;
      
      // Create birth data object
      const birthData = {
        name: formData.name,
        timestamp,
        latitude,
        longitude,
        gender: genderCode
      };
      
      // Create data hash (this would be used for verification)
      const dataString = JSON.stringify(birthData);
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      
      // Encrypt the data
      // In a real app, you would use the user's public key or a more secure method
      const encryptedData = CryptoJS.AES.encrypt(dataString, 'secret-key').toString();
      
      // Get signer
      const signer = provider.getSigner();
      
      // Mint the horoscope NFT
      const result = await mintHoroscope(
        signer,
        chainId || CHAIN_IDS.LOCALHOST,
        dataHash,
        encryptedData,
        formData.allowDataSharing
      );
      
      if (result.success) {
        setSuccess(`Successfully minted your horoscope NFT! Token ID: ${result.tokenId}`);
        setTokenId(result.tokenId);
        // Reset form
        setFormData({
          name: '',
          birthDate: '',
          birthTime: '',
          birthPlace: '',
          gender: '',
          allowDataSharing: false
        });
      } else {
        setError(result.error || 'Failed to mint horoscope NFT');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded shadow-md">
          <p>Please connect your wallet to mint your horoscope NFT.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">Generate Your Birth Chart</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md">
          <p>{success}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
              Birth Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthTime">
              Birth Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="birthTime"
              type="time"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthPlace">
              Birth Place
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="birthPlace"
              type="text"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              placeholder="City, Country"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowDataSharing"
                checked={formData.allowDataSharing}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                I allow my anonymized birth data to be used for compatibility matching
              </span>
            </label>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Birth Chart & Mint NFT'}
            </button>
          </div>
        </form>
      </div>
      
      {tokenId && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-purple-800">Your Horoscope NFT</h2>
          <p className="text-center mb-4">Token ID: {tokenId}</p>
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => window.location.href = `/horoscope/${tokenId}`}
            >
              View Your Horoscopes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthChart; 