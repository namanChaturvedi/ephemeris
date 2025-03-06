# Ephemeris Frontend

This is the frontend application for the Ephemeris Astrology DApp, built with React and Tailwind CSS.

## Overview

The frontend allows users to:

- Connect their wallet (MetaMask, etc.)
- Generate personalized horoscope birth charts
- Mint their birth chart as an NFT
- View their horoscope details
- Find compatible matches based on astrological compatibility

## Tech Stack

- React.js
- Tailwind CSS
- ethers.js for blockchain interactions
- React Router for navigation
- CryptoJS for encryption

## Project Structure

```
frontend/
├── public/                # Public assets
├── src/
│   ├── abis/             # Contract ABIs
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   ├── index.js           # Entry point
│   └── ...
└── ...
```

## Components

- **Alert**: Displays messages to the user
- **Button**: Reusable button component
- **Card**: Container for content
- **Modal**: Dialog for user interactions
- **FormInput**: Text input component
- **FormSelect**: Select dropdown component
- **FormCheckbox**: Checkbox component
- **FormDateTime**: Date and time input component
- **NetworkSelector**: Network selection dropdown
- **Spinner**: Loading indicator

## Pages

- **Home**: Landing page
- **BirthChart**: Form for entering birth details and minting NFT
- **Horoscope**: Displays horoscope details for a specific token
- **Matching**: Finds compatible matches based on horoscope

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_CHAIN_ID=0x539  # Default chain ID (0x539 for localhost)
```

## Connecting to Contracts

The application connects to the following smart contracts:

- **AstrologyNFT**: For minting and managing horoscope NFTs
- **MatchingEngine**: For finding compatible matches
- **HoroscopeOracle**: For retrieving horoscope data

Contract addresses are configured in `src/utils/contracts.js` for different networks.

## Security

- All sensitive user data is encrypted client-side before being stored on the blockchain
- Users control their data sharing preferences
- No private keys or sensitive information is stored in the application 