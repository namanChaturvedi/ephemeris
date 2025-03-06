// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMatchingEngine.sol";
import "./interfaces/IAstrologyNFT.sol";
import "./libraries/AstrologyCalculations.sol";

/**
 * @title MatchingEngine
 * @dev Contract for astrological matchmaking
 */
contract MatchingEngine is IMatchingEngine, Ownable {
    // Reference to the AstrologyNFT contract
    IAstrologyNFT private _astrologyNFT;
    
    // Mapping from token ID to match request status
    mapping(uint256 => bool) private _activeMatchRequests;
    
    // Array of active match requests
    uint256[] private _matchRequestTokenIds;
    
    /**
     * @dev Constructor
     * @param astrologyNFTAddress The address of the AstrologyNFT contract
     * @param initialOwner The initial owner of the contract
     */
    constructor(
        address astrologyNFTAddress,
        address initialOwner
    ) Ownable(initialOwner) {
        require(astrologyNFTAddress != address(0), "AstrologyNFT address cannot be zero");
        _astrologyNFT = IAstrologyNFT(astrologyNFTAddress);
    }
    
    /**
     * @dev Creates a match request
     * @param tokenId The ID of the horoscope NFT to use for matching
     */
    function createMatchRequest(uint256 tokenId) external override {
        // Verify that the sender owns the token
        require(
            _astrologyNFT.ownerOf(tokenId) == msg.sender,
            "Not the owner of the token"
        );
        
        // Verify that data sharing is allowed for the token
        require(
            _astrologyNFT.isDataSharingAllowed(tokenId),
            "Data sharing not allowed for this token"
        );
        
        // Add the match request if it doesn't already exist
        if (!_activeMatchRequests[tokenId]) {
            _activeMatchRequests[tokenId] = true;
            _matchRequestTokenIds.push(tokenId);
            
            emit MatchRequestCreated(msg.sender, tokenId);
        }
    }
    
    /**
     * @dev Cancels a match request
     * @param tokenId The ID of the horoscope NFT
     */
    function cancelMatchRequest(uint256 tokenId) external override {
        // Verify that the sender owns the token
        require(
            _astrologyNFT.ownerOf(tokenId) == msg.sender,
            "Not the owner of the token"
        );
        
        // Remove the match request if it exists
        if (_activeMatchRequests[tokenId]) {
            _activeMatchRequests[tokenId] = false;
            
            // Remove the token ID from the array
            for (uint256 i = 0; i < _matchRequestTokenIds.length; i++) {
                if (_matchRequestTokenIds[i] == tokenId) {
                    // Replace with the last element and pop
                    _matchRequestTokenIds[i] = _matchRequestTokenIds[_matchRequestTokenIds.length - 1];
                    _matchRequestTokenIds.pop();
                    break;
                }
            }
        }
    }
    
    /**
     * @dev Gets potential matches for a user
     * @param tokenId The ID of the horoscope NFT
     * @param limit The maximum number of matches to return
     * @return matches Array of potential matches
     */
    function getPotentialMatches(uint256 tokenId, uint256 limit) external view override returns (Match[] memory matches) {
        // Verify that the sender owns the token
        require(
            _astrologyNFT.ownerOf(tokenId) == msg.sender,
            "Not the owner of the token"
        );
        
        // Count the number of potential matches
        uint256 matchCount = 0;
        for (uint256 i = 0; i < _matchRequestTokenIds.length; i++) {
            uint256 otherTokenId = _matchRequestTokenIds[i];
            
            // Skip the user's own token and inactive requests
            if (otherTokenId != tokenId && _activeMatchRequests[otherTokenId]) {
                matchCount++;
            }
        }
        
        // Limit the number of matches
        uint256 resultCount = matchCount < limit ? matchCount : limit;
        matches = new Match[](resultCount);
        
        // Fill the matches array
        uint256 resultIndex = 0;
        for (uint256 i = 0; i < _matchRequestTokenIds.length && resultIndex < resultCount; i++) {
            uint256 otherTokenId = _matchRequestTokenIds[i];
            
            // Skip the user's own token and inactive requests
            if (otherTokenId != tokenId && _activeMatchRequests[otherTokenId]) {
                // Calculate compatibility score
                uint256 score = calculateCompatibility(tokenId, otherTokenId);
                
                // Add to matches
                matches[resultIndex] = Match({
                    user: _astrologyNFT.ownerOf(otherTokenId),
                    tokenId: otherTokenId,
                    score: score,
                    isActive: true
                });
                
                resultIndex++;
            }
        }
        
        return matches;
    }
    
    /**
     * @dev Calculates compatibility score between two horoscope NFTs
     * @param tokenId1 The ID of the first horoscope NFT
     * @param tokenId2 The ID of the second horoscope NFT
     * @return score The compatibility score (0-100)
     */
    function calculateCompatibility(uint256 tokenId1, uint256 tokenId2) public view override returns (uint256 score) {
        // Get zodiac signs for both tokens
        uint8 zodiac1 = _astrologyNFT.getZodiacSign(tokenId1);
        uint8 zodiac2 = _astrologyNFT.getZodiacSign(tokenId2);
        
        // Calculate compatibility using the AstrologyCalculations library
        return AstrologyCalculations.calculateCompatibility(zodiac1, zodiac2);
    }
}