// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IHoroscopeOracle
 * @dev Interface for the HoroscopeOracle contract
 */
interface IHoroscopeOracle {
    /**
     * @dev Emitted when weekly horoscopes are updated
     */
    event WeeklyHoroscopesUpdated(uint256 timestamp);
    
    /**
     * @dev Emitted when auspicious times are updated
     */
    event AuspiciousTimesUpdated(uint256 timestamp);
    
    /**
     * @dev Structure to store auspicious time details
     */
    struct AuspiciousTime {
        uint256 startTime;
        uint256 endTime;
        string activity;
        uint256 score;
    }
    
    /**
     * @dev Updates weekly horoscopes
     * @param zodiacSigns Array of zodiac sign indices (0-11)
     * @param horoscopes Array of encrypted weekly horoscopes
     */
    function updateWeeklyHoroscopes(uint8[] calldata zodiacSigns, bytes[] calldata horoscopes) external;
    
    /**
     * @dev Updates auspicious times
     * @param tokenId The ID of the horoscope NFT
     * @param encryptedAuspiciousTimes Encrypted auspicious times data
     */
    function updateAuspiciousTimes(uint256 tokenId, bytes calldata encryptedAuspiciousTimes) external;
    
    /**
     * @dev Gets the weekly horoscope for a zodiac sign
     * @param zodiacSign The zodiac sign index (0-11)
     * @return The encrypted weekly horoscope
     */
    function getWeeklyHoroscope(uint8 zodiacSign) external view returns (bytes memory);
    
    /**
     * @dev Gets auspicious times for a horoscope NFT
     * @param tokenId The ID of the horoscope NFT
     * @return The encrypted auspicious times data
     */
    function getAuspiciousTimes(uint256 tokenId) external view returns (bytes memory);
    
    /**
     * @dev Gets the zodiac sign for a horoscope NFT
     * @param tokenId The ID of the horoscope NFT
     * @return The zodiac sign index (0-11)
     */
    function getZodiacSign(uint256 tokenId) external view returns (uint8);
}