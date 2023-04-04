const express = require("express");
const app = express();
const generate=require("./generate")
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0477d6d89efe313dcc63599dbe0aff9f7a84129fcd00c8c952b4eba35da41547e25d69132809fe620cbdccf5fcb3f2f053842a302fbf660635c4e45f693732fd8c": 100,
  "041e7b0cec9217b3e2604f752f3805f52f10935aa51d8d4e0b1bce953f5cc95768ca298942265994e45695122c8421fb2b24f857cd4a9091f8c2fd75544cdf6dfa": 50,
  "048e2bd0844c517a2cf8877c7aa05a737ebfda87581f198e6d84e3e7feb766ca6ccace598e16192081960b4e4cc5ce5a95bdc5bad61a5cd6efdc7550e619f66cab": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;
  const pk=generate.signatureToPk(message,signature);
  const sender=generate.pktoAddress(pk);

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
