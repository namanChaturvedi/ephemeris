const { spawn } = require('child_process');
const path = require('path');

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
const frontendLogger = createLogger('Frontend', colors.magenta);

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
      mainLogger(`Deployment completed with code ${code}`);
      resolve();
    });
  });
  
  // Extract ABIs
  mainLogger('Extracting ABIs...');
  const abiProc = startProcess('node', ['scripts/extractAbi.js'], deployLogger);
  
  // Wait for ABI extraction to complete
  await new Promise((resolve) => {
    abiProc.on('close', (code) => {
      mainLogger(`ABI extraction completed with code ${code}`);
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
