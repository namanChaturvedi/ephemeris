// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IAstrologyNFT.sol";
import "./libraries/AstrologyCalculations.sol";

/**
 * @title AstrologyNFT
 * @dev Contract for minting and managing horoscope NFTs
 */
contract AstrologyNFT is IAstrologyNFT, ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    // Mapping from token ID to encrypted data
    mapping(uint256 => bytes) private _encryptedData;
    
    // Mapping from token ID to data hash
    mapping(uint256 => bytes32) private _dataHashes;
    
    // Mapping from token ID to data sharing preference
    mapping(uint256 => bool) private _dataSharingAllowed;
    
    // Mapping from token ID to zodiac sign
    mapping(uint256 => uint8) private _zodiacSigns;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    /**
     * @dev Constructor
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection
     * @param initialOwner The initial owner of the contract
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {}
    
    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI The base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Gets the base URI for token metadata
     * @return The base URI
     */
    function getBaseURI() external view returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Returns the URI for a token's metadata
     * @param tokenId The ID of the token
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory base = _baseTokenURI;
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";
    }
    
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
    ) external override returns (uint256 tokenId) {
        require(dataHash != bytes32(0), "Data hash cannot be empty");
        require(encryptedData.length > 0, "Encrypted data cannot be empty");
        
        // Get the next token ID
        tokenId = totalSupply();
        
        // Mint the NFT
        _mint(msg.sender, tokenId);
        
        // Store the encrypted data and data hash
        _encryptedData[tokenId] = encryptedData;
        _dataHashes[tokenId] = dataHash;
        _dataSharingAllowed[tokenId] = allowDataSharing;
        
        // Extract zodiac sign from the first byte of encrypted data
        // This is a simplified approach; in a real implementation,
        // the zodiac sign would be calculated from the birth data
        _zodiacSigns[tokenId] = uint8(encryptedData[0]);
        
        emit HoroscopeMinted(msg.sender, tokenId, dataHash);
        
        return tokenId;
    }
    
    /**
     * @dev Updates data sharing preferences for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @param allowDataSharing Whether to allow data sharing for advanced features
     */
    function updateDataSharing(uint256 tokenId, bool allowDataSharing) external override {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");
        
        _dataSharingAllowed[tokenId] = allowDataSharing;
        
        emit DataSharingUpdated(msg.sender, tokenId, allowDataSharing);
    }
    
    /**
     * @dev Gets the encrypted data for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return The encrypted data
     */
    function getEncryptedData(uint256 tokenId) external view override returns (bytes memory) {
        _requireOwned(tokenId);
        
        // Only the owner or someone with permission can access the data
        require(
            ownerOf(tokenId) == msg.sender || 
            (_dataSharingAllowed[tokenId] && msg.sender == owner()),
            "Not authorized to access data"
        );
        
        return _encryptedData[tokenId];
    }
    
    /**
     * @dev Checks if data sharing is allowed for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return Whether data sharing is allowed
     */
    function isDataSharingAllowed(uint256 tokenId) external view override returns (bool) {
        _requireOwned(tokenId);
        return _dataSharingAllowed[tokenId];
    }
    
    /**
     * @dev Gets the zodiac sign for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return The zodiac sign index (0-11)
     */
    function getZodiacSign(uint256 tokenId) external view returns (uint8) {
        _requireOwned(tokenId);
        return _zodiacSigns[tokenId];
    }
    
    /**
     * @dev Gets the data hash for a horoscope NFT
     * @param tokenId The ID of the NFT
     * @return The data hash
     */
    function getDataHash(uint256 tokenId) external view returns (bytes32) {
        _requireOwned(tokenId);
        return _dataHashes[tokenId];
    }
}