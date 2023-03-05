const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const message = JSON.stringify({ amount: 10, recipient: '0xad59d00947b585fb088b73a99e9dcb19eb5b5ad3' });
const hashedMsg = keccak256(utf8ToBytes(message));
console.log('Hashed Message: '+toHex(hashedMsg));

async function signTx() {
  const signature = await secp.sign(hashedMsg, 'ccb545f1852443c5fbf0bad15b577a44b80ee225990a4a528f68873a690cf9f5', { recovered: true });
  console.log({ signature: toHex(signature[0]), recover: signature[1] });
  console.log({ signature: toHex(signature[0]) + signature[1] });
}

signTx();

console.log('PublicKey: '+ toHex(secp.getPublicKey('ccb545f1852443c5fbf0bad15b577a44b80ee225990a4a528f68873a690cf9f5')));