const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const {keccak256} = require('ethereum-cryptography/keccak');
const {utf8ToBytes, toHex} = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xa8c635fbdbf5cf3807dc0678cf779111e00278be": 100, // f34ba3e6d3e9b0026c3c60b66ad4687db4dd61d94dd2961cc8ece5bf2fb483fe
  "0x8d588dc97609f289e57c4608559c1b9da1fccc7e": 50, // 2bc35dc93178cd4ec4436946b7f60681bf8f8e46721421b2ea3cf28d1a0c1217
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;
  const pubKey = secp.recoverPublicKey(keccak256(utf8ToBytes(amount.toString())), signature, recovery);
  if ('0x' + toHex(keccak256(pubKey).slice(-20)) !== sender) {
    res.status(400).send({ message: "Sender != signer" });
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
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
