// const express = require("express");
import express from 'express';
const app = express();
import cors from "cors";
// const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "028717a3b0e8bd0e0f3c1323ff3c59c96e447a85cf782ef863ee84647fa2654225": 100,
  "0277f13a7ea7a556dd76ab556ff7c934b4f0bcab2cd2e4eda0f3ccbd7c01daecbf": 50,
  "021717620815f3e936e0593835f89071458e74507e44af20c9cd91ccba4b653e09": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the  public address from the signature

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
