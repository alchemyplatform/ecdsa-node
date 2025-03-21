// const secp = require("ethereum-cryptography/secp256k1");
import secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils'
// const { keccak256 } = require("ethereum-cryptography/keccak");
// const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

function signMessage(message, privateKey) {
  const hash = hashMessage(message);
  const signature = secp.sign(hash, privateKey, { recovered: true });
  return signature;
}

function recoverKey(message, signature, recoveryBit) {
  const hash = hashMessage(message);
  const publicKey = secp.recoverPublicKey(hash, signature, recoveryBit);
  return publicKey;
}

export { hashMessage, signMessage, recoverKey };
