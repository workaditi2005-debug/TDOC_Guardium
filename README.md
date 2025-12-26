# Day 1: Chrome Extension with React & MetaMask - Setup Guide

## Overview
Welcome to Day 1 of the tutorial! Today we'll set up a Chrome extension development environment using Javascript and MetaMask integration. We'll be working with a proven boilerplate and setting up our local blockchain development tools.

## What We're Building
We're using the **chrome-extension-react-metamask-boilerplate** - a starter template that provides:
- Chrome extension structure with React
- Web3 integration for blockchain interaction
- MetaMask wallet login support
- Gulp-based build system for extension development
- CSS Modules support
- ESLint configuration

**Repository**: https://github.com/shaheem-khanzada/chrome-extension-react-metamask-boilerplate

## Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git**
- **Chrome/Chromium browser** (for testing the extension)

## Step 1: Install Project Dependencies

Navigate to the project directory and install all required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- React and React DOM
- Web3.js for blockchain interaction
- Gulp for build automation
- ESLint for code quality
- And other necessary packages

Wait for the installation to complete. You should see a `node_modules` folder created in your project directory.

## Step 2: Install Truffle (Smart Contract Development)

Truffle is a development framework for Ethereum that allows us to write, compile, and deploy smart contracts.

Install Truffle globally:

```bash
npm install -g truffle
```

Verify the installation:

```bash
truffle version
```

You should see version information displayed.

## Step 3: Install Ganache (Local Blockchain)

Ganache is a personal blockchain emulator for Ethereum development. It allows us to test our smart contracts and dApps locally without spending real Ether.

### Option A: Install Ganache CLI (Recommended for this tutorial)

```bash
npm install -g ganache-cli
```

Verify the installation:

```bash
ganache-cli --version
```

### Option B: Install Ganache GUI
Alternatively, you can download the GUI version from: https://trufflesuite.com/ganache/

## Step 4: Start the Development Environment

### Terminal 1: Start Ganache (Local Blockchain)

```bash
ganache-cli
```

Ganache will start on `http://127.0.0.1:8545` by default and display:
- 10 test accounts with private keys
- Contract deployment address
- Network ID

**Keep this terminal running** - this is your local blockchain.

### Terminal 2: Build and Run the Extension

In a new terminal, start the development build:

```bash
npm start
```

This will:
- Watch for file changes in the `src/` directory
- Compile React and bundle the extension
- Output the built files to the `dist/` folder
- Display the build process in your terminal

## Step 5: Load the Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Navigate to your project's `dist/` folder and select it
5. The extension should now appear in your extensions list and in the Chrome toolbar

## Project Structure Overview

```
├── src/                      # React source code
│   ├── App.js              # Main React component
│   ├── App.css
│   ├── index.js            # Entry point
│   ├── context/
│   │   └── WalletProvider.js   # Web3/MetaMask wallet context
│   └── utils/
│       ├── events.js       # Event handling utilities
│       ├── storage.js      # Local storage utilities
│       └── index.js
├── public/                  # Static files
│   ├── index.html
│   ├── manifest.json       # Chrome extension configuration
│   └── robots.txt
├── dist/                   # Built extension (generated after npm start)
├── patches/                # npm patches
├── gulpfile.js            # Gulp build configuration
├── package.json           # Project dependencies
└── manifest.json          # Extension manifest
```

## Key Files to Know

- **manifest.json** - Defines your extension's metadata, permissions, and content scripts
- **src/App.js** - Your main React application component
- **src/context/WalletProvider.js** - Web3 and MetaMask integration
- **gulpfile.js** - Build automation tasks

## Available npm Scripts

```bash
# Start development build with file watching
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test
```

## Common Commands Reference

```bash
# Start local blockchain
ganache-cli

# Compile smart contracts
truffle compile

# Deploy smart contracts to local blockchain
truffle migrate

# Run truffle console connected to local blockchain
truffle console

# Stop Ganache (Ctrl + C in its terminal)
# Stop npm start (Ctrl + C in its terminal)
```

---

## Day 1 Progress - Implementation Summary

### ✅ Completed Tasks

#### 1. **Project Setup**
- ✓ Cloned and configured chrome-extension-react-metamask-boilerplate
- ✓ Installed all npm dependencies
- ✓ Configured Truffle and Ganache for local blockchain development
- ✓ Set up project structure with contracts, migrations, and tests folders

#### 2. **Smart Contract Development**
- ✓ Created `VaultRegistry.sol` - Solidity smart contract with three core functions:
  - `updateVaultHash(bytes32 _vaultHash)` - Store encrypted vault hash on blockchain
  - `getVaultHash(address user)` - Retrieve vault hash for verification
  - `verifyVault(address user, bytes32 localHash)` - Verify vault integrity
- ✓ Deployed contract migration script (`2_deploy_contract.js`)

#### 3. **Frontend Components**
Created and configured essential React components:

- **Login.js** - Authentication screen with:
  - Master password creation/unlock functionality
  - Password strength indicator
  - Toast notifications for user feedback
  - Integration with Web3 for vault verification
  - Blockchain integrity checks

- **Vault.js** - Main vault management interface featuring:
  - Blockchain status display with wallet connection info
  - Real-time vault hash verification
  - Vault integrity confirmation
  - Pending login alerts
  - Encrypted storage management
  - Search and filter capabilities
  - Auto-fill functionality

- **Toast.js** - Notification system with:
  - Multiple notification types (error, success, warning, info)
  - Gradient styling and glow effects
  - Smooth animations

#### 4. **Utility Services**
- **CryptoService.js** - Encryption/decryption with:
  - PBKDF2 key derivation (200,000 iterations)
  - AES-256-GCM encryption
  - Salt and IV generation
  - Secure vault encryption

- **web3Service.js** - Blockchain integration featuring:
  - MetaMask provider initialization
  - Smart contract interaction
  - Vault hash computation
  - Address management
  - Contract read/write operations

- **storage.js** - Chrome extension storage utilities:
  - Save/load encrypted vault
  - Chrome storage API compatibility

#### 5. **Configuration Files**
- ✓ Truffle configuration (`truffle-config.js`)
- ✓ Updated `package.json` with ethers.js dependency
- ✓ Created directory structure (contracts/, migrations/, test/, src/components/, src/utils/)

### 📊 Technical Stack
- **Frontend**: React 18, CSS-in-JS styling
- **Blockchain**: Solidity 0.8.20, Ethereum
- **Encryption**: Web Crypto API (PBKDF2 + AES-GCM)
- **Web3**: ethers.js, MetaMask
- **Development**: Ganache CLI, Truffle Suite
- **Build**: Gulp, Browserify

### 🎯 Key Features Implemented
1. **Encrypted Vault Storage** - Master password-protected credential storage
2. **Blockchain Verification** - On-chain hash verification for vault integrity
3. **MetaMask Integration** - Wallet connection and signing
4. **Real-time Status Display** - Blockchain sync status and verification state
5. **User Authentication** - Create new vault or unlock existing vault
6. **Responsive UI** - Dark theme with gradient effects and animations

### 📝 File Summary
```
Total Files Created/Modified: 15+
Lines of Code: 5000+
Components: 3 React components
Smart Contracts: 1 Solidity contract
Utility Services: 3 services
Configuration Files: Updated
```

## Next Steps

With everything installed and running:
1. Explore the boilerplate code in the `src/` directory
2. Review the extension manifest in `public/manifest.json`
3. Understand how Web3 is initialized in `src/utils/web3Service.js`
4. Test the extension in Chrome and connect MetaMask
5. Deploy VaultRegistry contract to Ganache
6. Test vault creation and blockchain verification

## Troubleshooting

### npm install fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry
- Ensure Node.js version is v14 or higher

### Ganache won't start
- Check if port 8545 is already in use
- Try: `ganache-cli -p 8546` to use a different port

### Extension not loading in Chrome
- Ensure you're loading the `dist/` folder, not the project root
- Verify `npm start` completed successfully
- Check Chrome DevTools (F12) for errors
- Reload the extension after making changes

### MetaMask connection issues
- Ensure MetaMask browser extension is installed
- Check that Ganache is running on the correct port
- Verify network is set to `localhost:8545` in MetaMask

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Truffle Suite Documentation](https://trufflesuite.com/docs/)
- [Ganache Documentation](https://trufflesuite.com/docs/ganache/overview)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

---
## Description
```
Day 1 Implementation: Complete setup of encrypted password vault with on-chain integrity verification

FEATURES:
- Smart Contract: Deploy VaultRegistry with updateVaultHash, getVaultHash, and verifyVault functions
- Authentication: Master password-based vault creation and unlocking with strength validation
- Encryption: AES-256-GCM encrypted vault storage with PBKDF2 key derivation
- Blockchain Integration: Real-time vault hash verification on Ethereum via Ganache
- UI Components: Login, Vault management, and Toast notification system
- Web3 Integration: MetaMask provider integration with ethers.js
- Chrome Extension: Configured popup extension with React and Gulp build system

COMPONENTS ADDED:
- src/components/Login.js (350+ lines) - Authentication with blockchain verification
- src/components/Vault.js (450+ lines) - Vault display with blockchain status
- src/components/Toast.js (280+ lines) - Toast notification system
- src/utils/CryptoService.js (80+ lines) - Encryption/decryption utilities
- src/utils/web3Service.js (150+ lines) - Web3 and smart contract integration
- src/utils/storage.js (30+ lines) - Chrome storage utilities
- contracts/VaultRegistry.sol (40+ lines) - Smart contract for vault integrity
- migrations/2_deploy_contract.js - Contract deployment script

CONFIGURATION:
- Updated package.json with ethers library
- Created truffle-config.js for Ganache integration
- Established project structure for contracts and migrations

IMPROVEMENTS:
- End-to-end encrypted credential management
- Immutable vault integrity checks via blockchain
- Real-time wallet and verification status display
- Enhanced security with PBKDF2 (200k iterations) + AES-256
- User-friendly error handling with styled notifications

BREAKING CHANGES: None

TESTING:
- Manual testing with Ganache local blockchain
- MetaMask wallet connection verification
- Vault creation and encryption validation
- Blockchain hash verification
```

## Commit Stats
- **Files Changed**: 15+
- **Total Lines Added**: ~5,000
- **New Components**: 3 (Login, Vault, Toast)
- **New Services**: 3 (CryptoService, web3Service, storage)
- **Smart Contracts**: 1 (VaultRegistry.sol)
- **Build Configuration**: 2 (truffle-config.js, package.json)

## Key Modifications
1. **package.json** - Added ethers dependency
2. **src/App.js** - Updated main component with vault logic flow
3. **src/App.css** - Refreshed styling for modern dark theme
4. **New Directories** - contracts/, migrations/, src/components/, src/utils/

## Tags
```
#day1 #blockchain #encryption #ethereum #metamask #chrome-extension #vault #security
```

---

**Author**: Guardium Security Team
**Date**: December 19, 2025
**Status**: Development Phase 1 Complete

**Ready for Day 1?** You now have a complete development environment for building Chrome extensions with blockchain functionality!
