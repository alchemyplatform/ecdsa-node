const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

const signMessage = (message, privateKey) => {
  return secp.sign(hashMessage(message), privateKey, { recovered: true });
}

const recoverKey = (message, signature, recoveryBit) => {
  return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit);
}


module.exports = {
  hashMessage,
  signMessage,
  recoverKey,
};