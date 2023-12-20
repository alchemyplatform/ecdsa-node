const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02934ced33f9e6a87739a9565b8862d69851a30d70610be20d0c78ea9abb0ffbff": 100,
  "035da5a0724382511ad63ced8075940cbc281caa1992e6d0f4950f55b5ca5ae5b5": 50,
  "0380fdf5cebbe3fc1903f8fbebbbb6ce4120d6b8b6e5b043d8843c4cdb6f0b86fb": 75,
};

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
