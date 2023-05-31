const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } =  require("ethereum-cryptography/secp256k1.js");
// const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");
// const {secpNoble} = import("@noble/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "03d744dc7a618e2f63a93df35c3417c1e89a89519daff307ced45c16330b850bb5": 100, // 509d9ff9bb5700b0f4e8ecbb33db7250f78b780c8560809ef067247fe3c39841
  "02702dd1cd7a36e8078eeec404fc5957a66870417fdee271e3b14de2b7637a4927": 50, // 2b584df48dcf617b6a695c4cf472a0bd255c873c61b26c39be36de3649a1ca23
  "0283f8a7ea97add16d3b6cbb246b281c010955b399d6e0d401bc06a0e0d14de2cb": 75 // a149e3c464514dbac65d2019c1f68622301d02373a9dd9c8ae0c75d3411e2248
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address.toString()] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { privateKey, recipient, amount } = req.body;
  const hash = keccak256(utf8ToBytes((`${recipient} ${amount}`)));
  const privateKeyBytes = new Uint8Array(privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const signature = secp256k1.sign(toHex(hash),privateKeyBytes);
  // const signature = secpNoble.sign(toHex(hash), privateKey);
  // const sender = secpNoble.recoverPublicKey(hash, signature, recoveryBit, isCompressed = false);
  // const sender = signature.recoverPublicKey(hash, privateKeyBytes); 
  // console.log(sender.toString);
  const sender = toHex(secp256k1.getPublicKey(privateKey)).toString();
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
