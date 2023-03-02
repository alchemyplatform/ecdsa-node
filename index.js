const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04c8a3cc26b8efe3e1a79e09b4c180b72ee82d1a03db4269f64b1dfe21c52aaa9ffb85f7471938bf360d7e24edbc63776b6b1a53a20c817ad52c6bebc340b359bb": 100,
  "047a03a4f67319ae9a47e4f28376574f60afbdccb782e126ec0e2425bf754b681aa8a24fb6d5bea5b695250b5874b6035a96624e2ff0e2a165d51ce14ac3e30d85": 50,
  "04c30daf1ee646e641ee016908cd9f16734134ac054d4fdf18dc15bfac43955a30de6ca888d2af0566c8c6795105d8b0acf34affd1a48071ab0459aadd4a9759c6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

//TODO: get a signature from the client side application
// recover the public key from the signature

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
