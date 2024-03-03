// Import the necessary modules
const { randomBytes } = require('crypto');
const secp = require('ethereum-cryptography/secp256k1').secp256k1;
const { toHex } = require('ethereum-cryptography/utils');

// Generate a random 32-byte private key
const privateKey = randomBytes(32);
console.log('Private Key:', toHex(privateKey));
const publicKey = secp.getPublicKey(privateKey);
const publicKeyHex = toHex(publicKey);
console.log('Public Key:', publicKeyHex);
