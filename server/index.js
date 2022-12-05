const express = require("express");
const app = express();
const cors = require("cors");
const { getAddress } = require("./scripts/cryptography");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "3b01872578dc3a74bbaafa4ded424b54cefc7883": 100,
  "5342f7810d21bb46fb2093e77fc3cf9a0b4a8b20": 50,
  "50aeafd07d1cf0bc3fa3665e94e4a7e91fd70d46": 75,
};

app.get("/balance/:privateKey", async (req, res) => {
  const { privateKey } = req.params;
  const message = "Get Blanace";
  const address = await getAddress(message, privateKey);
  console.log("address: ", address);
  
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount } = req.body;

  const senderAddress = await getAddress("Get Balance", sender);
  const recipientAddress = await getAddress("Get Balance", recipient);

  setInitialBalance(senderAddress);
  setInitialBalance(recipientAddress);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipientAddress] += amount;
    res.send({ balance: balances[senderAddress] });
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
