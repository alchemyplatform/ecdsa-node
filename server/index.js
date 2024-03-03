const express = require("express");
const app = express();
const cors = require("cors");
const { ethers } = require("ethers");

// const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x459940270370F1710d7955bF4b599298CbaB1783": 100,
  "0x1aE9C871e288131414879Aa02550dB90394c4432": 50,
  "0xD2Bf0137B23d128285a827f3077Db708736b2025": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, message } = req.body;
  if (!signature || !message) {
    return res.status(400).send({ message: "Signature or message not provided." });
  }

  try {
    const utils = ethers.utils;
    const recoveredAddress = utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== sender.toLowerCase()) {
      return res.status(403).send({ message: "Signature verification failed." });
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
  } catch (error) {
    console.error("Error recovering address from signature:", error);
    res.status(500).send({ message: "Internal Server Error." });
  }
});

// app.listen(port, () => {
//   console.log(`Listening on port ${port}!`);
// });

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

module.exports = app;
