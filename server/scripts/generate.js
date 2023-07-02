const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils"); 
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();
console.log("privateKey:", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log("publicKey:", toHex(publicKey));


//Ethereum address
//last 20 bytes of the keccak256 hash of the public key
const ethereumAddress = keccak256(publicKey.slice(1)).slice(-20);
// Check size with ethereumAddress.byteLength
//console.log("ethereumAddress length: ", ethereumAddress.byteLength);

console.log("ethereum address: 0x" + toHex(ethereumAddress));