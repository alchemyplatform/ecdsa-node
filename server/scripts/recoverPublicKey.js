const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const ethUtil = require("ethereumjs-util");

const message = Buffer.from("Hello World!", "utf8");
const messageHash = keccak256(message);

console.log("Message hash:", messageHash.toString("hex"));

const privateKey = Buffer.from(
  "0895341cb46a79ef27845eda70febaed408dabf634cbaef33c2e50af81f04fab",
  "hex"
);

const signatureObject = secp256k1.sign(messageHash, privateKey);
console.log("Signature Object:", signatureObject);

// Convert r and s values to hexadecimal strings
const rHex = signatureObject.r.toString(16).padStart(64, "0");
const sHex = signatureObject.s.toString(16).padStart(64, "0");

// Calculate v value
const v = signatureObject.recovery + 27; // Ethereum's v is recovery id + 27

// Concatenate r, s, and v values to form the complete signature in hexadecimal
const signatureHex = "0x" + rHex + sHex + v.toString(16).padStart(2, "0"); // Ensure v is 2 characters long

console.log("Signature Hex:", signatureHex);

// Split the signature hex into r, s, and v
const r = signatureHex.slice(2, 66); // slice(2) is used to remove the '0x' prefix
const s = signatureHex.slice(66, 130);
const vHex = signatureHex.slice(130, 132);

// Convert r, s, and v back to Buffers
const rBuf = Buffer.from(r, "hex");
const sBuf = Buffer.from(s, "hex");
const vBuf = Buffer.from(vHex, "hex");

// Recover the public key
const publicKeyBuffer = ethUtil.ecrecover(
  messageHash,
  vBuf.readUInt8(),
  rBuf,
  sBuf
);

// Convert the public key to hexadecimal format
const publicKeyHex = ethUtil.bufferToHex(publicKeyBuffer);

console.log("=====================================");
console.log("Public Key:", publicKeyHex);
console.log("=====================================");
