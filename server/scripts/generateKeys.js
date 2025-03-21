const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = toHex(secp.utils.randomPrivateKey());
const publicKey = toHex(secp.getPublicKey(privateKey));

console.log("Private key:", privateKey);
console.log("Public key:", publicKey);