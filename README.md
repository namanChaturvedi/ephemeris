# Ephemeris Astrology DApp

A decentralized application built on the Binance Smart Chain that enables users to generate personalized horoscope birth charts and mint them as NFTs.

## Overview

This project is an astrology dApp that allows users to:

1. Connect their wallet (MetaMask, etc.)
2. Enter their birth details (date, time, place, and gender)
3. Generate a personalized horoscope birth chart using astrological calculations
4. Mint an NFT representing their unique horoscope
5. Manage data sharing preferences for advanced features

The system uses complex astronomical algorithms to compute planetary positions, houses, aspects, and more to derive a horoscope that reflects various aspects of a user's personality, career, relationships, and lucky numbers.

## Key Features

- **Wallet Integration**: Secure wallet connection for authentication
- **Birth Data Input**: Form for entering date, time, place of birth, and gender
- **Astrological Calculations**: Integration with Swiss Ephemeris for accurate calculations
- **NFT Minting**: ERC721 standard NFTs representing horoscope birth charts
- **Data Privacy**: Non-custodial encryption of sensitive user data
- **Data Sharing Controls**: User-managed consent for sharing encrypted data
- **Advanced Features**: Matchmaking, weekly horoscopes, and auspicious timing

## Tech Stack

- **Frontend**: React with TypeScript
- **Smart Contracts**: Solidity ^0.8.0
- **Development Environment**: Hardhat
- **Blockchain Interaction**: ethers.js
- **Blockchain**: Binance Smart Chain
- **External API**: Swiss Ephemeris (or equivalent) for astrological calculations

## Project Structure

```
/
├── contracts/               # Smart contracts
│   ├── interfaces/          # Contract interfaces
│   ├── libraries/           # Solidity libraries
│   ├── AstrologyNFT.sol     # Main NFT contract
│   ├── MatchingEngine.sol   # Matchmaking contract
│   └── HoroscopeOracle.sol  # Oracle for horoscope updates
├── frontend/                # React frontend
│   ├── components/          # UI components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   └── ...                  # Other frontend files
├── scripts/                 # Deployment scripts
├── test/                    # Contract tests
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- MetaMask or another web3 wallet

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ephemeris-astrology-dapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

### Development

1. Start the local Hardhat node:
   ```
   npx hardhat node
   ```

2. Deploy contracts to the local network:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

### Testing

Run the smart contract tests:
```
npx hardhat test
```

## Security

- All user data is encrypted and stored non-custodially
- Users control their data via their wallets
- Smart contracts follow best practices for security and gas optimization

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

The AGPL-3.0 is a copyleft license that requires anyone who distributes your code or a derivative work to make the source available under the same terms, and also requires that the source be provided to anyone who interacts with the software over a network.

For more information, see the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

To add the full license text to your project, you can create a LICENSE file with the content from: https://www.gnu.org/licenses/agpl-3.0.txt

## Acknowledgements

- [Swiss Ephemeris](https://www.astro.com/swisseph/swephinfo_e.htm) for astrological calculations
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Binance Smart Chain](https://www.binance.org/en/smartChain) for the blockchain platform