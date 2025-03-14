const { secp256k1 } = require("@noble/curves/secp256k1");
const { keccak_256 } = require("@noble/hashes/sha3");
const { bytesToHex } = require("@noble/hashes/utils");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const address = bytesToHex(keccak_256(publicKey).slice(-20));

console.log(`Private Key:  ${bytesToHex(privateKey)}`);
console.log(`Public Key:  ${bytesToHex(publicKey)}`);
console.log(`Address: ${address}`);