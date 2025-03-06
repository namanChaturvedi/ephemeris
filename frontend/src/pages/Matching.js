import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '../context/WalletContext';
import { getAstrologyNFTContract, getMatchingEngineContract, createMatchRequest, getPotentialMatches } from '../utils/contractHelpers';
import { CHAIN_IDS } from '../utils/contracts';

const Matching = () => {
  const { account, chainId, provider } = useContext(WalletContext);
  
  const [userTokens, setUserTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [matches, setMatches] = useState([]);
  
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!provider || !account) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        const nftContract = getAstrologyNFTContract(provider, chainId || CHAIN_IDS.LOCALHOST);
        
        // Get token count for the user
        const balance = await nftContract.balanceOf(account);
        const tokenCount = balance.toNumber();
        
        // Get all tokens owned by the user
        const tokens = [];
        for (let i = 0; i < tokenCount; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(account, i);
          
          // Get token metadata (in a real app, you would fetch more details)
          const allowsDataSharing = await nftContract.allowsDataSharing(tokenId);
          
          tokens.push({
            id: tokenId.toString(),
            allowsDataSharing
          });
        }
        
        setUserTokens(tokens);
        
        // If user has tokens and none selected, select the first one
        if (tokens.length > 0 && !selectedToken) {
          setSelectedToken(tokens[0].id);
        }
      } catch (err) {
        console.error('Error fetching user tokens:', err);
        setError('Failed to load your horoscope NFTs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTokens();
  }, [provider, account, chainId]);
  
  const handleCreateMatchRequest = async () => {
    if (!selectedToken) {
      setError('Please select a horoscope NFT first');
      return;
    }
    
    try {
      setIsCreatingRequest(true);
      setError('');
      setSuccess('');
      
      // Check if data sharing is allowed for this token
      const nftContract = getAstrologyNFTContract(provider, chainId || CHAIN_IDS.LOCALHOST);
      const allowsDataSharing = await nftContract.allowsDataSharing(selectedToken);
      
      if (!allowsDataSharing) {
        setError('This horoscope NFT does not allow data sharing. Please enable data sharing first.');
        return;
      }
      
      // Create match request
      const signer = provider.getSigner();
      const result = await createMatchRequest(signer, chainId || CHAIN_IDS.LOCALHOST, selectedToken);
      
      if (result.success) {
        setSuccess('Match request created successfully! Finding potential matches...');
        // Fetch matches after creating request
        fetchMatches();
      } else {
        setError(result.error || 'Failed to create match request');
      }
    } catch (err) {
      console.error('Error creating match request:', err);
      setError(err.message || 'An error occurred while creating the match request');
    } finally {
      setIsCreatingRequest(false);
    }
  };
  
  const fetchMatches = async () => {
    if (!selectedToken) {
      setError('Please select a horoscope NFT first');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Get potential matches
      const result = await getPotentialMatches(
        provider,
        chainId || CHAIN_IDS.LOCALHOST,
        selectedToken,
        10 // Limit to 10 matches
      );
      
      if (result.success) {
        setMatches(result.matches);
      } else {
        setError(result.error || 'Failed to get potential matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'An error occurred while fetching potential matches');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTokenChange = (e) => {
    setSelectedToken(e.target.value);
    setMatches([]);
  };
  
  const getCompatibilityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getCompatibilityText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };
  
  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded shadow-md">
          <p>Please connect your wallet to use the matching feature.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">Cosmic Connections</h1>
      
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
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">Find Your Cosmic Match</h2>
        
        {userTokens.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p>You don't have any horoscope NFTs yet. Mint one to start finding matches!</p>
            <button
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => window.location.href = '/birth-chart'}
            >
              Mint Horoscope NFT
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tokenSelect">
                Select Your Horoscope NFT
              </label>
              <select
                id="tokenSelect"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedToken}
                onChange={handleTokenChange}
                disabled={isLoading || isCreatingRequest}
              >
                <option value="">Select a token</option>
                {userTokens.map(token => (
                  <option key={token.id} value={token.id}>
                    Token #{token.id} {!token.allowsDataSharing && '(Data sharing disabled)'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                onClick={handleCreateMatchRequest}
                disabled={isLoading || isCreatingRequest || !selectedToken}
              >
                {isCreatingRequest ? 'Creating Request...' : 'Create Match Request'}
              </button>
              
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                onClick={fetchMatches}
                disabled={isLoading || !selectedToken}
              >
                {isLoading ? 'Finding Matches...' : 'Find Matches'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {matches.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Your Potential Matches</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Compatibility
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-4 border-b border-gray-200">
                      #{match.tokenId.toString()}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      {match.user.slice(0, 6)}...{match.user.slice(-4)}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${match.compatibilityScore}%` }}
                          ></div>
                        </div>
                        <span className={getCompatibilityColor(match.compatibilityScore)}>
                          {match.compatibilityScore}% - {getCompatibilityText(match.compatibilityScore)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      {match.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => window.location.href = `/horoscope/${match.tokenId}`}
                      >
                        View Horoscope
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {matches.length === 0 && (
            <p className="text-gray-600 text-center py-4">No matches found. Try creating a match request first.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Matching; 