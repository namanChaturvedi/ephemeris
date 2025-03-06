const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to create a prefixed logger
const createLogger = (prefix, color) => {
  return (message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${color}[${timestamp}] ${prefix}:${colors.reset} ${message}`);
  };
};

// Create loggers
const mainLogger = createLogger('Main', colors.green);
const nodeLogger = createLogger('Node', colors.yellow);
const deployLogger = createLogger('Deploy', colors.cyan);

// Function to start a process
const startProcess = (command, args, logger, cwd = process.cwd()) => {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });
  
  proc.stdout.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) logger(line);
    });
  });
  
  proc.stderr.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) logger(`${colors.red}${line}${colors.reset}`);
    });
  });
  
  proc.on('close', (code) => {
    logger(`Process exited with code ${code}`);
  });
  
  return proc;
};

// Function to update hardhat.config.js
const updateHardhatConfig = () => {
  mainLogger('Updating hardhat.config.js...');
  
  const configPath = path.join(process.cwd(), 'hardhat.config.js');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Generate a random mnemonic (for testing only)
  const testMnemonic = 'test test test test test test test test test test test junk';
  
  // Check if private network is already configured
  if (configContent.includes('private:')) {
    mainLogger('Private network already configured in hardhat.config.js');
    return;
  }
  
  // Add private network configuration
  const networkConfig = `
  private: {
    url: "http://127.0.0.1:8545",
    accounts: {
      mnemonic: "${testMnemonic}", // DO NOT use in production
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 10
    },
    chainId: 1337,
    saveDeployments: true
  },`;
  
  // Insert the private network configuration
  const networksIndex = configContent.indexOf('networks:');
  if (networksIndex !== -1) {
    // Find the position after 'networks: {'
    const insertPosition = configContent.indexOf('{', networksIndex) + 1;
    configContent = configContent.slice(0, insertPosition) + networkConfig + configContent.slice(insertPosition);
  } else {
    // If networks section doesn't exist, create it
    const moduleExportsIndex = configContent.indexOf('module.exports');
    if (moduleExportsIndex !== -1) {
      const insertPosition = configContent.indexOf('{', moduleExportsIndex) + 1;
      configContent = configContent.slice(0, insertPosition) + `
  networks: {${networkConfig}
  },` + configContent.slice(insertPosition);
    }
  }
  
  // Write the updated config back to the file
  fs.writeFileSync(configPath, configContent);
  mainLogger('Updated hardhat.config.js with private network configuration');
  
  // Create a .env.private file with the test mnemonic
  const envPath = path.join(process.cwd(), '.env.private');
  fs.writeFileSync(envPath, `PRIVATE_TESTNET_MNEMONIC="${testMnemonic}"\n`);
  mainLogger('Created .env.private file with test mnemonic');
};

// Function to create MetaMask configuration instructions
const createMetaMaskInstructions = () => {
  const instructionsPath = path.join(process.cwd(), 'private-testnet-setup.md');
  const instructions = `# Private Testnet Setup Instructions

## MetaMask Configuration

1. Open MetaMask and click on the network dropdown at the top
2. Click "Add Network" and then "Add a network manually"
3. Enter the following details:
   - Network Name: Ephemeris Private
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

## Test Accounts

The following test accounts have been created with 1000 ETH each:

\`\`\`
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (1000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (1000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (1000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
\`\`\`

To import these accounts into MetaMask:
1. Click on your account icon in MetaMask
2. Click "Import Account"
3. Paste the private key and click "Import"

## Deploying Contracts

To deploy contracts to the private testnet:

\`\`\`
npm run deploy:private
\`\`\`

## Running the Frontend

To run the frontend connected to the private testnet:

\`\`\`
npm run frontend:private
\`\`\`

## Notes

- This is a local private testnet for development and testing only
- Do NOT use these accounts or mnemonics in production
- The testnet will be reset when the node is stopped
`;

  fs.writeFileSync(instructionsPath, instructions);
  mainLogger('Created private-testnet-setup.md with MetaMask configuration instructions');
};

// Function to update package.json with new scripts
const updatePackageJson = () => {
  mainLogger('Updating package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add new scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'node:private': 'hardhat node',
    'deploy:private': 'hardhat run scripts/deploy.js --network private',
    'frontend:private': 'cd frontend && cross-env REACT_APP_CHAIN_ID=0x539 npm start',
    'setup:private': 'node scripts/setup-private-testnet.js',
    'start:private': 'node scripts/start-private-testnet.js'
  };
  
  // Write the updated package.json back to the file
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  mainLogger('Updated package.json with private testnet scripts');
};

// Function to create a script to start the private testnet
const createStartScript = () => {
  const startScriptPath = path.join(process.cwd(), 'scripts', 'start-private-testnet.js');
  const startScript = `const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m'
};

// Function to create a prefixed logger
const createLogger = (prefix, color) => {
  return (message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(\`\${color}[\${timestamp}] \${prefix}:\${colors.reset} \${message}\`);
  };
};

// Create loggers
const mainLogger = createLogger('Main', colors.green);
const nodeLogger = createLogger('Node', colors.yellow);
const deployLogger = createLogger('Deploy', colors.cyan);
const frontendLogger = createLogger('Frontend', colors.magenta);

// Function to start a process
const startProcess = (command, args, logger, cwd = process.cwd()) => {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });
  
  proc.stdout.on('data', (data) => {
    data.toString().split('\\n').forEach(line => {
      if (line.trim()) logger(line);
    });
  });
  
  proc.stderr.on('data', (data) => {
    data.toString().split('\\n').forEach(line => {
      if (line.trim()) logger(\`\${colors.red}\${line}\${colors.reset}\`);
    });
  });
  
  proc.on('close', (code) => {
    logger(\`Process exited with code \${code}\`);
  });
  
  return proc;
};

// Main function
const main = async () => {
  mainLogger('Starting private testnet environment...');
  
  // Start Hardhat node
  mainLogger('Starting Hardhat node...');
  const nodeProc = startProcess('npm', ['run', 'node:private'], nodeLogger);
  
  // Wait for Hardhat node to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Deploy contracts to private network
  mainLogger('Deploying contracts to private network...');
  const deployProc = startProcess('npm', ['run', 'deploy:private'], deployLogger);
  
  // Wait for deployment to complete
  await new Promise((resolve) => {
    deployProc.on('close', (code) => {
      mainLogger(\`Deployment completed with code \${code}\`);
      resolve();
    });
  });
  
  // Extract ABIs
  mainLogger('Extracting ABIs...');
  const abiProc = startProcess('node', ['scripts/extractAbi.js'], deployLogger);
  
  // Wait for ABI extraction to complete
  await new Promise((resolve) => {
    abiProc.on('close', (code) => {
      mainLogger(\`ABI extraction completed with code \${code}\`);
      resolve();
    });
  });
  
  // Start frontend
  mainLogger('Starting frontend...');
  const frontendProc = startProcess('npm', ['run', 'frontend:private'], frontendLogger);
  
  // Handle process termination
  const cleanup = () => {
    mainLogger('Shutting down...');
    nodeProc.kill();
    frontendProc.kill();
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

// Run the main function
main().catch((error) => {
  console.error(colors.red, 'Error:', error, colors.reset);
  process.exit(1);
});
`;

  fs.writeFileSync(startScriptPath, startScript);
  fs.chmodSync(startScriptPath, '755');
  mainLogger('Created scripts/start-private-testnet.js');
};

// Main function
const main = async () => {
  mainLogger('Setting up private testnet...');
  
  // Update hardhat.config.js
  updateHardhatConfig();
  
  // Create MetaMask configuration instructions
  createMetaMaskInstructions();
  
  // Update package.json
  updatePackageJson();
  
  // Create start script
  createStartScript();
  
  // Install cross-env for frontend environment variables
  mainLogger('Installing cross-env...');
  const installProc = startProcess('npm', ['install', '--save-dev', 'cross-env'], mainLogger);
  
  // Wait for installation to complete
  await new Promise((resolve) => {
    installProc.on('close', (code) => {
      mainLogger(`Installation completed with code ${code}`);
      resolve();
    });
  });
  
  mainLogger('Private testnet setup complete!');
  mainLogger('To start the private testnet, run: npm run start:private');
  mainLogger('For more information, see private-testnet-setup.md');
};

// Run the main function
main().catch((error) => {
  console.error(colors.red, 'Error:', error, colors.reset);
  process.exit(1);
}); 