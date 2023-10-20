const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

const privKey = secp.secp256k1.utils.randomPrivateKey();
console.log('private key:', toHex(privKey));

const pubKey = secp.secp256k1.getPublicKey(privKey);
console.log('public key:', pubKey.join(''));
console.log('public address:', '0x' + keccak256(pubKey.slice(1)).slice(-20).join(''));