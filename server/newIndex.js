const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { Transaction, utils } = require("ethereumjs-tx");

app.use(cors());
app.use(express.json());

const balances = {
  "089b40fad730c2e6edc3": 100,
  "9b7fcd1c1787f635d8a6": 50,
  "cb062d401405b8ea555c": 75,
};

// Function to verify a signature
function verifySignature(messageHash, signature, publicKey) {
  return Transaction.verifyTransaction(messageHash, signature, publicKey);
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  // Verify the signature
  const messageHash = utils.sha3(utils.toBuffer(`${sender}${recipient}${amount}`));
  const isValid = verifySignature(messageHash, signature, sender);

  if (!isValid) {
    res.status(403).send({ message: "Invalid signature" });
    return;
  }

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
  console.log(`Listening on port ${port}`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
