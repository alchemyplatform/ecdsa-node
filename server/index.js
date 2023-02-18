const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04b7e289c022835d415569488c8c072a622aa1cbf5d956efea6ebcf41d83fe19b05213c6ef3c408517625605c244460fb30b6d582b48c629a7fa32c91a6d30547a": 100,
  "0415126b6b2df78427c07af6a8466aa839f19f7e5a4dfb6e745eea376ad095b58ccf52656cb505d6808ffb1d5300aba6f04569e1e1d5a9624d679346b10ad321af": 50,
  "044fb79348548c606f082cc2482187f577e9a39d9a4dfb5c14fec11eb10f9488b3692c11c66998f104c29aed1bfae24463e30f0f1d954760bcc0e4af01cd34cc06": 75,
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

// Private key: 355db4e0530bc99783775c2c1bfd198fc843e9e17a3313d69c71b45253ef5f77
// Public key: 04b7e289c022835d415569488c8c072a622aa1cbf5d956efea6ebcf41d83fe19b05213c6ef3c408517625605c244460fb30b6d582b48c629a7fa32c91a6d30547a

// Private key: be6788c3716419d0028a3f8003c55ba36c0230b1624fc5d6f4841e3b8d0b1b9b
// Public key: 0415126b6b2df78427c07af6a8466aa839f19f7e5a4dfb6e745eea376ad095b58ccf52656cb505d6808ffb1d5300aba6f04569e1e1d5a9624d679346b10ad321af

// Private key: 49beed66929c4e2231e3b4a2af6ed32f3c597002128dfa691bc3c0555ba4239d
// Public key: 044fb79348548c606f082cc2482187f577e9a39d9a4dfb5c14fec11eb10f9488b3692c11c66998f104c29aed1bfae24463e30f0f1d954760bcc0e4af01cd34cc06