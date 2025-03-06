// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMatchingEngine
 * @dev Interface for the MatchingEngine contract
 */
interface IMatchingEngine {
    /**
     * @dev Emitted when a match request is created
     */
    event MatchRequestCreated(address indexed requester, uint256 indexed tokenId);
    
    /**
     * @dev Emitted when a match is found
     */
    event MatchFound(address indexed requester, address indexed matchedUser, uint256 score);
    
    /**
     * @dev Structure to store match details
     */
    struct Match {
        address user;
        uint256 tokenId;
        uint256 score;
        bool isActive;
    }
    
    /**
     * @dev Creates a match request
     * @param tokenId The ID of the horoscope NFT to use for matching
     */
    function createMatchRequest(uint256 tokenId) external;
    
    /**
     * @dev Cancels a match request
     * @param tokenId The ID of the horoscope NFT
     */
    function cancelMatchRequest(uint256 tokenId) external;
    
    /**
     * @dev Gets potential matches for a user
     * @param tokenId The ID of the horoscope NFT
     * @param limit The maximum number of matches to return
     * @return matches Array of potential matches
     */
    function getPotentialMatches(uint256 tokenId, uint256 limit) external view returns (Match[] memory matches);
    
    /**
     * @dev Calculates compatibility score between two horoscope NFTs
     * @param tokenId1 The ID of the first horoscope NFT
     * @param tokenId2 The ID of the second horoscope NFT
     * @return score The compatibility score (0-100)
     */
    function calculateCompatibility(uint256 tokenId1, uint256 tokenId2) external view returns (uint256 score);
}