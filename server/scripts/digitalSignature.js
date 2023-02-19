const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

const hashMessage = (message) => keccak256(Uint8Array.from(message));

const pubKeyToAddress = (pubKey) => {
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toUpperCase();
};

