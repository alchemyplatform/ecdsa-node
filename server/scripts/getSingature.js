const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { bufferToHex } = require("ethereumjs-util");

const message = Buffer.from("Hello ETH!!!", "utf8");
const messageHash = keccak256(message);

console.log("Message hash:", messageHash.toString("hex"));

const privateKey = Buffer.from(
  "eb51d46e2c4a838fe64c66e869619f8047d5f7b5f3eb9dd64831ba346817f448",
  "hex"
);

const signatureObject = secp256k1.sign(messageHash, privateKey);

console.log("Signature:", signatureObject);

// Convert r and s values to hexadecimal strings
const rsHex = bufferToHex(signatureObject.signature);

// Calculate v value
const v = bufferToHex(Buffer.from([signatureObject.recovery + 27])); // Ethereum's v is recovery id + 27

// Concatenate r, s, and v values to form the complete signature in hexadecimal
const signatureHex = rsHex + v.slice(2); // slice(2) is used to remove the '0x' prefix from v

console.log("Signature:", signatureHex);

// Recover the public key
const publicKeyBuffer = secp256k1.ecdsaRecover(
  Buffer.from(signatureHex.slice(2), "hex"), // Remove the '0x' prefix and convert to Buffer
  signatureObject.recovery,
  messageHash,
  false // This argument specifies whether to return the public key in compressed or uncompressed format
);

// Convert the public key to hexadecimal format
const publicKeyHex = bufferToHex(publicKeyBuffer);

console.log("Public Key:", publicKeyHex);
