// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IAstrologyNFT
 * @dev Interface for the AstrologyNFT contract
 */
interface IAstrologyNFT is IERC721 {
    /**
     * @dev Emitted when a new horoscope NFT is minted
     */
    event HoroscopeMinted(address indexed owner, uint256 indexed tokenId, bytes32 dataHash);
    
    /**
     * @dev Emitted when data sharing preferences are updated
     */
    event DataSharingUpdated(address indexed owner, uint256 indexed tokenId, bool isShared);
    
    /**
     * @dev Mints a new horoscope NFT
     * @param dataHash The hash of the encrypted birth data and astrological calculations
     * @param encryptedData The encrypted birth data and astrological calculations
     * @param allowDataSharing Whether to allow data sharing for advanced features
     * @return tokenId The ID of the minted NFT
     */
    function mintHoroscope(
        bytes32 dataHash,
        bytes calldata encryptedData,
        bool allowDataSharing
    ) external returns (uint256 tokenId);
    
    /**
     * @dev Updates data sharing preferences for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @param allowDataSharing Whether to allow data sharing for advanced features
     */
    function updateDataSharing(uint256 tokenId, bool allowDataSharing) external;
    
    /**
     * @dev Gets the encrypted data for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return The encrypted data
     */
    function getEncryptedData(uint256 tokenId) external view returns (bytes memory);
    
    /**
     * @dev Checks if data sharing is allowed for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return Whether data sharing is allowed
     */
    function isDataSharingAllowed(uint256 tokenId) external view returns (bool);
    
    /**
     * @dev Gets the zodiac sign for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return The zodiac sign index (0-11)
     */
    function getZodiacSign(uint256 tokenId) external view returns (uint8);
}