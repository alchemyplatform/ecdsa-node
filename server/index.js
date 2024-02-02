const express = require("express");
const { keyGenerator } = require("./scripts/keyGen")
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

let money = 100

const balances = {};

while(Object.keys(balances).length < 3){
  balances[keyGenerator()] = money
  money /= 2
}

console.log(balances)

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
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
