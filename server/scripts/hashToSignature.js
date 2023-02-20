const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

(async () => {

  const PRIVATE_KEY = "77484d45ecfe34287a9d88a4f8ec3eb9cd92ce55dc3a9ba4be57ee4126c32e89"

  let message = {
    from: "b83ab85e1fbe71c7e7643df5de9f7cc6be4f96da",
    to: "c42da13bc0dcb20f3fb7af2433dfe10641721501",
    amount: 10
  }
  console.log("Mesage:", message);

  const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
  console.log("Message Hash:", messageHash);

  const [signature, recoveryBit] = await secp.sign(messageHash, PRIVATE_KEY, { recovered: true });
  console.log("Signature:", toHex(signature));
  console.log("Recovery Bit:", recoveryBit);

  const publicKey = toHex(secp.recoverPublicKey(messageHash, signature, recoveryBit));
  console.log("Public Key:", publicKey);

})();