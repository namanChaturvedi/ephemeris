import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { WalletContext } from '../context/WalletContext';
import { getAstrologyNFTContract, getWeeklyHoroscope, getAuspiciousTimes } from '../utils/contractHelpers';
import { CHAIN_IDS } from '../utils/contracts';

const Horoscope = () => {
  const { tokenId } = useParams();
  const { account, chainId, provider } = useContext(WalletContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [weeklyHoroscope, setWeeklyHoroscope] = useState(null);
  const [auspiciousTimes, setAuspiciousTimes] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const fetchHoroscopeData = async () => {
      if (!provider || !tokenId) return;
      
      try {
        setLoading(true);
        setError('');
        
        const nftContract = getAstrologyNFTContract(provider, chainId || CHAIN_IDS.LOCALHOST);
        
        // Check if the connected account is the owner of the token
        const owner = await nftContract.ownerOf(tokenId);
        const isCurrentOwner = account && owner.toLowerCase() === account.toLowerCase();
        setIsOwner(isCurrentOwner);
        
        // Get horoscope data
        const data = await nftContract.getHoroscopeData(tokenId);
        
        // In a real app, you would decrypt the data if you have the key
        // For now, we'll use mock data
        const mockHoroscopeData = {
          zodiacSign: tokenId % 12, // Mock zodiac sign (0-11)
          ascendant: (tokenId + 3) % 12,
          moonSign: (tokenId + 6) % 12,
          planets: [
            { name: 'Sun', sign: tokenId % 12, house: 1 },
            { name: 'Moon', sign: (tokenId + 6) % 12, house: 4 },
            { name: 'Mercury', sign: (tokenId + 1) % 12, house: 3 },
            { name: 'Venus', sign: (tokenId + 2) % 12, house: 7 },
            { name: 'Mars', sign: (tokenId + 4) % 12, house: 10 },
            { name: 'Jupiter', sign: (tokenId + 8) % 12, house: 2 },
            { name: 'Saturn', sign: (tokenId + 9) % 12, house: 6 }
          ],
          houses: Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            sign: (tokenId + i) % 12
          }))
        };
        
        setHoroscopeData(mockHoroscopeData);
        
        // Get weekly horoscope
        const horoscopeResult = await getWeeklyHoroscope(
          provider,
          chainId || CHAIN_IDS.LOCALHOST,
          mockHoroscopeData.zodiacSign
        );
        
        if (horoscopeResult.success) {
          setWeeklyHoroscope(horoscopeResult.horoscope);
        }
        
        // Get auspicious times
        if (isCurrentOwner) {
          const timesResult = await getAuspiciousTimes(
            provider,
            chainId || CHAIN_IDS.LOCALHOST,
            tokenId
          );
          
          if (timesResult.success) {
            setAuspiciousTimes(timesResult.times);
          }
        }
      } catch (err) {
        console.error('Error fetching horoscope data:', err);
        setError('Failed to load horoscope data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscopeData();
  }, [provider, tokenId, account, chainId]);
  
  const getZodiacName = (index) => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio', 
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    return signs[index % 12];
  };
  
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading horoscope data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!horoscopeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <p>No horoscope data found for token ID: {tokenId}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">
        Your Cosmic Profile - Token #{tokenId}
      </h1>
      
      {!account && (
        <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 mb-6 rounded shadow-md">
          <p>Connect your wallet to see if you're the owner of this horoscope.</p>
        </div>
      )}
      
      {account && isOwner && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md">
          <p>You are the owner of this horoscope NFT.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Birth Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Birth Chart</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Sun Sign</h3>
            <p className="text-xl">{getZodiacName(horoscopeData.zodiacSign)}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Ascendant</h3>
            <p className="text-xl">{getZodiacName(horoscopeData.ascendant)}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Moon Sign</h3>
            <p className="text-xl">{getZodiacName(horoscopeData.moonSign)}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Planetary Positions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Planet
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sign
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      House
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {horoscopeData.planets.map((planet, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border-b border-gray-200">{planet.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{getZodiacName(planet.sign)}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{planet.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Weekly Horoscope Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Weekly Horoscope</h2>
          
          {weeklyHoroscope ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Updated: {formatDateTime(weeklyHoroscope.timestamp)}
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">General</h3>
                <p className="text-gray-700">{weeklyHoroscope.general}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Love</h3>
                <p className="text-gray-700">{weeklyHoroscope.love}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Career</h3>
                <p className="text-gray-700">{weeklyHoroscope.career}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Health</h3>
                <p className="text-gray-700">{weeklyHoroscope.health}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Lucky Numbers</h3>
                <div className="flex flex-wrap gap-2">
                  {weeklyHoroscope.luckyNumbers.map((number, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Weekly horoscope not available.</p>
          )}
        </div>
      </div>
      
      {/* Auspicious Times Section - Only visible to the owner */}
      {isOwner && auspiciousTimes && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Auspicious Times</h2>
          
          <p className="text-sm text-gray-500 mb-4">
            Updated: {formatDateTime(auspiciousTimes.timestamp)}
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cosmic Alignments</h3>
            <ul className="list-disc pl-5 space-y-2">
              {auspiciousTimes.alignments.map((alignment, index) => (
                <li key={index} className="text-gray-700">{alignment}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Favorable Times for Activities</h3>
            
            <div className="space-y-4">
              {auspiciousTimes.activities.map((activity, index) => (
                <div key={index} className="border-l-4 border-indigo-400 pl-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">{activity.name}</h4>
                  <ul className="space-y-2">
                    {activity.times.map((time, timeIndex) => (
                      <li key={timeIndex} className="text-gray-700">
                        {formatDateTime(time.start)} - {formatDateTime(time.end)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Horoscope; 