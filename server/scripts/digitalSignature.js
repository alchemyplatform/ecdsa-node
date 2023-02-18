const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');

function hashMessage(message) {
  let bytes = utf8ToBytes(message);
  let hash = keccak256(bytes);
  return hash;
}



