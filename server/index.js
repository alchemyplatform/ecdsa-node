const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

let balances = {
  //use the faucet to get some funds
  // "0x1": 50, // Alice
  // "0x2": 50,  // Bob
  // "0x3": 75,  // Charlie
};

let faucetBalance = 1000;

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/faucetBalance", (req, res) => {
  res.send({ faucetBalance });
});

app.post("/receiveFromFaucet", (req, res) => {
  const { amount, recipient } = req.body;

  //Debug (see server logs)
  console.log("\nNew request from faucet!");
  console.log("recipient:", recipient);
  console.log("faucet balance:", faucetBalance);
  console.log("requested amount:", amount);

  setInitialBalance(recipient);

  if (amount > faucetBalance) {
      res.status(400).send({ message: "Not enough funds in Server Faucet!" });
      console.log("Not enough funds!");
  } else {
      faucetBalance -= amount;
      balances[recipient] += amount;
      res.send({ newFaucetBalance: faucetBalance });
      console.log("new faucet balance:", faucetBalance);
  }
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature --> becomes sender

  const { sender, recipient, amount } = req.body;

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