const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1")
const { keccak224 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1cad49ffd4d4945b09c2133e8e5c37462d5171d271bb78f13e100c9a": 100,
  "0x964049308d9f1c8f95291ad60731e4308add04454cf45cf20abf301a": 50,
  "0xad8a29d5dddcda8a44a04b897ba881d86b0e27275b7bd91a96496e9f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, pubKey } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const txData = {
    "sender": sender,
    "amount": amount,
    "recipient": recipient
  }
  const txDataHash = keccak224(utf8ToBytes(JSON.stringify(txData)))
  console.log("Server:  ---- sender:  " +  sender)
  console.log("Server:  ---- rec:  " +  recipient)
  console.log("Server:  ---- amount:  " +  amount)
  console.log("Server:  ---- signature:  " +  signature)
  console.log("Server:  ---- pubKey:  " +  pubKey)
  
  // Verify the signature
  if (balances[sender] < amount) {
    console.log("Made it to the sending part")
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    console.log("in else statement server")
    if (secp.verify(signature, txDataHash, pubKey)) {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    } else {
      console.log("Failed to verify")
      res.status(405).send({ message: "Verification failed"})
    }
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
