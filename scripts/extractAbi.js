const fs = require('fs');
const path = require('path');

// Define the contracts to extract ABIs for
const contracts = [
  'AstrologyNFT',
  'MatchingEngine',
  'HoroscopeOracle'
];

// Define the paths
const artifactsDir = path.join(__dirname, '../artifacts/contracts');
const outputDir = path.join(__dirname, '../frontend/src/abis');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Extract ABIs for each contract
contracts.forEach(contractName => {
  const contractArtifactPath = path.join(artifactsDir, `${contractName}.sol/${contractName}.json`);
  
  try {
    // Read the contract artifact
    const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    
    // Extract the ABI
    const abi = contractArtifact.abi;
    
    // Write the ABI to a file
    const outputPath = path.join(outputDir, `${contractName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
    
    console.log(`Extracted ABI for ${contractName} to ${outputPath}`);
  } catch (error) {
    console.error(`Error extracting ABI for ${contractName}:`, error);
  }
});

console.log('ABI extraction complete!');