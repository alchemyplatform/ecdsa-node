const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils");

function generateAddress(){
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKeyOriginal = secp.getPublicKey(privateKey);
    const publicKey = toHex(publicKeyOriginal);
    const address = '0x'+toHex(keccak256(publicKeyOriginal.slice(1)).slice(-20));
    return {privateKey, publicKey, address}
};

console.log(generateAddress());
// console.log('Private Key: ' + toHex(privateKey));
// console.log('Public Key: ' + toHex(publicKey));
// console.log('Public Key: 0x' + toHex(publicKey2));