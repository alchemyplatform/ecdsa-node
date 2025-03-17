const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { getRandomBytesSync } = require("ethereum-cryptography/random");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");




//const privateKey = secp.utils.randomPrivateKey();

const privateKey = getRandomBytesSync(32);
console.log('private key:',toHex(privateKey));
const publicKey = secp256k1.getPublicKey(privateKey);
console.log('public key:',toHex(publicKey));
