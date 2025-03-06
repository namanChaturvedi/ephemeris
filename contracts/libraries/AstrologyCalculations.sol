// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AstrologyCalculations
 * @dev Library for astrological calculations
 * Note: Most complex astrological calculations are performed off-chain using Swiss Ephemeris
 * This library provides utility functions for on-chain operations
 */
library AstrologyCalculations {
    // Zodiac sign names - not stored as constants due to Solidity limitations
    // These are defined as functions instead
    function getZodiacSignName(uint8 index) internal pure returns (string memory) {
        if (index == 0) return "Aries";
        if (index == 1) return "Taurus";
        if (index == 2) return "Gemini";
        if (index == 3) return "Cancer";
        if (index == 4) return "Leo";
        if (index == 5) return "Virgo";
        if (index == 6) return "Libra";
        if (index == 7) return "Scorpio";
        if (index == 8) return "Sagittarius";
        if (index == 9) return "Capricorn";
        if (index == 10) return "Aquarius";
        if (index == 11) return "Pisces";
        revert("Invalid zodiac sign index");
    }
    
    // Planet names - not stored as constants due to Solidity limitations
    function getPlanetName(uint8 index) internal pure returns (string memory) {
        if (index == 0) return "Sun";
        if (index == 1) return "Moon";
        if (index == 2) return "Mercury";
        if (index == 3) return "Venus";
        if (index == 4) return "Mars";
        if (index == 5) return "Jupiter";
        if (index == 6) return "Saturn";
        if (index == 7) return "Uranus";
        if (index == 8) return "Neptune";
        if (index == 9) return "Pluto";
        revert("Invalid planet index");
    }
    
    // House systems
    enum HouseSystem {
        Placidus,
        Koch,
        Equal,
        Whole,
        Regiomontanus,
        Campanus,
        Porphyry
    }
    
    /**
     * @dev Validates a zodiac sign index
     * @param zodiacIndex The zodiac sign index to validate
     * @return isValid Whether the zodiac sign index is valid
     */
    function isValidZodiacSign(uint8 zodiacIndex) internal pure returns (bool isValid) {
        return zodiacIndex < 12;
    }
    
    /**
     * @dev Calculates the zodiac sign index from a birth timestamp
     * Note: This is a simplified calculation and should be replaced with
     * more accurate calculations from Swiss Ephemeris off-chain
     * @param birthTimestamp The birth timestamp
     * @return The zodiac sign index (0-11)
     */
    function calculateZodiacSign(uint256 birthTimestamp) internal pure returns (uint8) {
        // This is a placeholder implementation
        // In a real implementation, this would be calculated off-chain
        // and the result would be passed to the contract
        return uint8(birthTimestamp % 12);
    }
    
    /**
     * @dev Calculates compatibility between two zodiac signs
     * @param zodiac1 The first zodiac sign index (0-11)
     * @param zodiac2 The second zodiac sign index (0-11)
     * @return score The compatibility score (0-100)
     */
    function calculateCompatibility(uint8 zodiac1, uint8 zodiac2) internal pure returns (uint256 score) {
        require(isValidZodiacSign(zodiac1) && isValidZodiacSign(zodiac2), "Invalid zodiac sign indices");
        
        // This is a simplified compatibility calculation
        // In a real implementation, this would use more complex astrological rules
        
        // Calculate element compatibility
        uint8 element1 = zodiac1 % 4; // Fire (0), Earth (1), Air (2), Water (3)
        uint8 element2 = zodiac2 % 4;
        
        // Elements of the same type have high compatibility
        if (element1 == element2) {
            score = 80;
        } 
        // Complementary elements have medium compatibility
        // Fire (0) and Air (2) are complementary
        // Earth (1) and Water (3) are complementary
        else if ((element1 == 0 && element2 == 2) || 
                 (element1 == 2 && element2 == 0) ||
                 (element1 == 1 && element2 == 3) ||
                 (element1 == 3 && element2 == 1)) {
            score = 60;
        } 
        // Other combinations have lower compatibility
        else {
            score = 40;
        }
        
        // Adjust score based on other factors
        // For example, signs that are 180 degrees apart (opposite) can have intense relationships
        if ((zodiac1 + 6) % 12 == zodiac2) {
            score = (score * 110) / 100; // Increase by 10%
        }
        
        // Ensure score is within 0-100 range
        if (score > 100) {
            score = 100;
        }
        
        return score;
    }
    
    /**
     * @dev Generates a hash from birth data
     * @param birthTimestamp The birth timestamp
     * @param birthLatitude The birth latitude (scaled by 1e6)
     * @param birthLongitude The birth longitude (scaled by 1e6)
     * @param gender The gender (0 for male, 1 for female, 2 for other)
     * @return The birth data hash
     */
    function generateBirthDataHash(
        uint256 birthTimestamp,
        int256 birthLatitude,
        int256 birthLongitude,
        uint8 gender
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            birthTimestamp,
            birthLatitude,
            birthLongitude,
            gender
        ));
    }
}