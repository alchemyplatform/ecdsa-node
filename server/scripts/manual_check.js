const { secp256k1 } = require("@noble/curves/secp256k1");
const { keccak_256 } = require("@noble/hashes/sha3");
const { bytesToHex, hexToBytes } = require("@noble/hashes/utils");

const privateKey = hexToBytes("ENTER_A_VALID_PRIVATE_KEY_HERE");
const publicKey = secp256k1.getPublicKey(privateKey);
const address = bytesToHex(keccak_256(publicKey).slice(-20));

console.log(`Address: ${address}`);  