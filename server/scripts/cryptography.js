const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');


const hashMessage = (message) => {
    let bytes = utf8ToBytes(message);
    return keccak256(bytes);
}

const signMessage = async (message, privateKey) => {
    let hash = hashMessage(message);
    return secp.sign(hash, privateKey, {recovered: true});
}

const recoverKey = (message, signature, recoveryBit) => {
    let hash = hashMessage(message);
    return secp.recoverPublicKey(hash, signature, recoveryBit);
}

const getAddress = async (message, privateKey) => {
    const [sig, recoveryBit] = await signMessage(message, privateKey);
    const recoveryKey = recoverKey(message, sig, recoveryBit);
    const slicedPublickey = recoveryKey.slice(1);
    const keccak = keccak256(slicedPublickey);
    return toHex(keccak.slice(-20));
}

module.exports = { getAddress };

// private key 1: cdb9e4375c44d33c80ee6c09f71ec3040fab2bb078a70e829e1193efb1aa1551 ----> address: 3b01872578dc3a74bbaafa4ded424b54cefc7883
// private key 2: 4791bdd76e771b729152b4464fca807d2e8ad55cb6a15601ea21e3b80a6f0535 ----> address: 5342f7810d21bb46fb2093e77fc3cf9a0b4a8b20
// private key 3: 2a51b21a31600e1342cf1d258d911aab314c7f01c9ba753eabc24021089d9dc2 ----> address: 50aeafd07d1cf0bc3fa3665e94e4a7e91fd70d46