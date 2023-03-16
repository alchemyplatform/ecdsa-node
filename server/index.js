const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toBuffer } = require("ethereum-cryptography/utils");
const { sign, recoverPublicKey } = require("ethereum-cryptography/secp256k1");
const { Buffer } = require("buffer");


app.use(cors());
app.use(express.json());

const balances = {
  "0476a0eb9bc67343f6b6708fe477d452b9308f4064125df0a0648bdc297aa2c6cdbb765fe39d1fa9391b106808924c6cae36b81d0daba74ad244b518946d9231c7": 100,
  "04f368ef9ec9dc637d9a857b22798c9ab062586f7414b17ee3601d46e9039828d0bfc852685ed24cae9b6270c0cb0884801ec7f757edd285513e2eb32242b5394a": 50,
  "049447e6c76f088549b54d2af2538c84808bec45899fd4b789f92256c88cf9c53ef203271b651305043e4999122674a9a9b608948449bb43e5d18e498bb9474fb7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Verify the signature
  const messageHash = toBuffer(`send ${amount} to ${recipient}`);
  const publicKey = recoverPublicKey(messageHash, signature);
  if (!publicKey || !publicKey.equals(toBuffer(sender, "hex"))) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

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
