const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// Private Key: d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87
// Public Key: 02fcf05d916b4600bd986770d37a5483d8ea0f8140c4e73297e0e7aa7cbaeccf71
// to hex 0x459940270370F1710d7955bF4b599298CbaB1783
// ❯ node generate.js
// Private Key: b1a8527873d6b62a786ab65d59da195c6c4a102a9abd96186b69c40407d2f0d9
// Public Key: 02589d1315270a9ae5e46191dc8a46eb36953ab4572e88f707700dd134aa67429b
// eth 0x1aE9C871e288131414879Aa02550dB90394c4432
// ❯ node generate.js
// Private Key: f2c23bd541a1d6735fdb8a9b0eeaa0a26e5e21aec6c95204359e0456d5df5102
// Public Key: 02a3c5b3456fc616ed729504731922b099b994e132897067489eebc5e31c7589d5
// eth 0xD2Bf0137B23d128285a827f3077Db708736b2025

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
  // TODO: get a signature from client-side
  // recover the public address from fignature 
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
