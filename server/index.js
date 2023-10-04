const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const ethUtil = require("ethereumjs-util");

app.use(cors());
app.use(express.json());

const balances = {
  "0248dd515a61632ab805c8c7f54dbbfd85422c7b747968965b43b0174b684dcd7b": 99,
  "03117242481b97802a9b74f136423445915f966751fe49fc24837eefd6dedbfdca": 50,
  "03faf8bf234290968f9c2197368ea8febe18d478aad4c0168e32dc3aaae5cc1bdf": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, messageHash } = req.body;

  //Derive sender addresss from signature and message hash

  console.log("Signature Hash", sender);
  console.log("Message Hash", messageHash);
  console.log("Amount to transfer", amount);
  console.log("Recipient", recipient);

  const signatureHex = sender;
  // Split the signatureHex into r, s, and v
  const r = signatureHex.slice(2, 66);
  const s = signatureHex.slice(66, 130);
  const vHex = signatureHex.slice(130, 132);
  console.log("r", r);
  console.log("s", s);
  console.log("v", vHex);

  // Convert r, s, and v back to Buffers
  const rBuf = Buffer.from(r, "hex");
  const sBuf = Buffer.from(s, "hex");
  const vBuf = Buffer.from(vHex, "hex");

  console.log("rBuf", rBuf);
  console.log("sBuf", sBuf);
  console.log("vBuf", vBuf);

  // Convert the comma-separated string to an array of numbers
  const messageHashArray = messageHash.split(",").map(Number);

  // Convert the array of numbers to a Buffer
  const messageHashBuffer = Buffer.from(messageHashArray);

  // Now pass messageHashBuffer to the ecrecover function
  const publicKeyBuffer = ethUtil.ecrecover(
    messageHashBuffer,
    vBuf.readUInt8(),
    rBuf,
    sBuf
  );

  // Convert the public key to hexadecimal format
  const publicKeyHex = ethUtil.bufferToHex(publicKeyBuffer);
  console.log("Public Key Buffer", publicKeyBuffer);
  console.log("=====================================");
  console.log("Public Key:", publicKeyHex);
  console.log("=====================================");

  // console.log("Ethereum Address:", addressHex);

  const uncompressedKey = publicKeyHex; // replace with your uncompressed public key
  console.log("Uncompressed Key", uncompressedKey);
  const compressedKey = compressPublicKey(uncompressedKey);
  console.log("Compressed Key", compressedKey); // Should log the compressed public key with 0x02 or 0x03 prefix

  setInitialBalance(compressedKey);
  setInitialBalance(recipient);

  const senderAddress = compressedKey;

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  console.log("address & Balance", address, balances[address]);
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function compressPublicKey(uncompressedKey) {
  // Ensure the key is a Buffer
  const keyBuffer = Buffer.isBuffer(uncompressedKey)
    ? uncompressedKey
    : Buffer.from(uncompressedKey.slice(2), "hex"); // Remove the '0x' prefix

  // The uncompressed key should have a length of 64 bytes
  if (keyBuffer.length !== 64) {
    throw new Error("Invalid uncompressed public key length");
  }

  // Extract the x and y coordinates
  const x = keyBuffer.slice(0, 32); // bytes 0-32 (inclusive)
  const y = keyBuffer.slice(32); // bytes 32-64 (inclusive)

  // Determine the prefix: 0x02 for even y, 0x03 for odd y
  const prefix = y[y.length - 1] % 2 === 0 ? "02" : "03";

  // Construct the compressed public key
  const compressedKey = prefix + x.toString("hex");

  return compressedKey;
}
