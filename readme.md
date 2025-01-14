# ECDSA Node

This project demonstrates a simple digital signature implementation using the Ethereum ECDSA (Elliptic Curve Digital Signature Algorithm) for secure transactions.

## New Features
- 🔒 Secure private key encryption using AES-256
- ✅ Wallet creation with automatic key encryption
- 💫 Transaction signing with encrypted keys
- 🛡️ Robust error handling and validation

## Security Features
- Private keys are never stored in plain text
- AES-256 encryption for key storage
- Signature verification for all transactions
- Proper error handling for security-related operations

## Prerequisites
- Node.js and npm installed
- Environment variables set up (see below)

## Environment Variables
Create a `.env` file in the server directory:
```env
ENCRYPTION_KEY=your-32-character-encryption-key
```

## Getting Started
1. Clone the repository
2. Install dependencies:
```bash
cd server
npm install
```

3. Set up your environment variables
4. Run the tests:
```bash
npx ts-node src/scripts/tests/wallet.test.ts
npx ts-node src/scripts/tests/wallet-edge-cases.test.ts
```

## Security Considerations
- Keep your ENCRYPTION_KEY secure and never commit it to version control
- Private keys are encrypted at rest
- All transactions require valid signatures