const secp=require("ethereum-cryptography/secp256k1")
const {toHex}=require("ethereum-cryptography/utils")
const privateKey=secp.utils.randomPrivateKey();
console.log("private key:",toHex(privateKey));
const publicKey=secp.getPublicKey(privateKey);
console.log('public key:',toHex(publicKey))