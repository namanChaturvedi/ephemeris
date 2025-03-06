// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IHoroscopeOracle.sol";
import "./interfaces/IAstrologyNFT.sol";
import "./libraries/AstrologyCalculations.sol";

/**
 * @title HoroscopeOracle
 * @dev Contract for weekly horoscopes and auspicious timing
 */
contract HoroscopeOracle is IHoroscopeOracle, Ownable {
    // Reference to the AstrologyNFT contract
    IAstrologyNFT private _astrologyNFT;
    
    // Mapping from zodiac sign to weekly horoscope
    mapping(uint8 => bytes) private _weeklyHoroscopes;
    
    // Mapping from token ID to auspicious times
    mapping(uint256 => bytes) private _auspiciousTimes;
    
    // Last update timestamp for weekly horoscopes
    uint256 private _lastWeeklyUpdate;
    
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
     * @dev Updates weekly horoscopes
     * @param zodiacSigns Array of zodiac sign indices (0-11)
     * @param horoscopes Array of encrypted weekly horoscopes
     */
    function updateWeeklyHoroscopes(uint8[] calldata zodiacSigns, bytes[] calldata horoscopes) external override onlyOwner {
        require(zodiacSigns.length == horoscopes.length, "Arrays must have the same length");
        
        for (uint256 i = 0; i < zodiacSigns.length; i++) {
            require(AstrologyCalculations.isValidZodiacSign(zodiacSigns[i]), "Invalid zodiac sign index");
            _weeklyHoroscopes[zodiacSigns[i]] = horoscopes[i];
        }
        
        _lastWeeklyUpdate = block.timestamp;
        
        emit WeeklyHoroscopesUpdated(block.timestamp);
    }
    
    /**
     * @dev Updates auspicious times
     * @param tokenId The ID of the horoscope NFT
     * @param encryptedAuspiciousTimes Encrypted auspicious times data
     */
    function updateAuspiciousTimes(uint256 tokenId, bytes calldata encryptedAuspiciousTimes) external override onlyOwner {
        // Verify that the token exists
        require(_astrologyNFT.ownerOf(tokenId) != address(0), "Token does not exist");
        
        _auspiciousTimes[tokenId] = encryptedAuspiciousTimes;
        
        emit AuspiciousTimesUpdated(block.timestamp);
    }
    
    /**
     * @dev Gets the weekly horoscope for a zodiac sign
     * @param zodiacSign The zodiac sign index (0-11)
     * @return The encrypted weekly horoscope
     */
    function getWeeklyHoroscope(uint8 zodiacSign) external view override returns (bytes memory) {
        require(AstrologyCalculations.isValidZodiacSign(zodiacSign), "Invalid zodiac sign index");
        return _weeklyHoroscopes[zodiacSign];
    }
    
    /**
     * @dev Gets auspicious times for a horoscope NFT
     * @param tokenId The ID of the horoscope NFT
     * @return The encrypted auspicious times data
     */
    function getAuspiciousTimes(uint256 tokenId) external view override returns (bytes memory) {
        // Verify that the token exists
        require(_astrologyNFT.ownerOf(tokenId) != address(0), "Token does not exist");
        
        // Verify that the sender is authorized to access the data
        require(
            _astrologyNFT.ownerOf(tokenId) == msg.sender || 
            (_astrologyNFT.isDataSharingAllowed(tokenId) && msg.sender == owner()),
            "Not authorized to access data"
        );
        
        return _auspiciousTimes[tokenId];
    }
    
    /**
     * @dev Gets the zodiac sign for a horoscope NFT
     * @param tokenId The ID of the horoscope NFT
     * @return The zodiac sign index (0-11)
     */
    function getZodiacSign(uint256 tokenId) external view override returns (uint8) {
        return _astrologyNFT.getZodiacSign(tokenId);
    }
    
    /**
     * @dev Gets the last update timestamp for weekly horoscopes
     * @return The last update timestamp
     */
    function getLastWeeklyUpdate() external view returns (uint256) {
        return _lastWeeklyUpdate;
    }
}