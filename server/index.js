const express = require("express");
const app = express();
const cors = require("cors");
const { verify } = require("./verification");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
/*public key:*/ "03c781cf2662714a11a3a9f98654d09abf35b59bb29952cf35f55088ce27166dba": 100, // Private Key: 3ae0ffa9b45dcf48baba0c45eb4f4dc3b6d7f4ed8e8d38548409c33d851d3734
/*public key:*/ "0226afe000841b07c5f988abdb85f069d969697f7e576f9ba3217f75086d9b906d": 50 , // Private Key: 328fa7d1cb0ff6fd9e3e86a217f467d17e42aa3125b6c76ca18c0ca8ea07b5d3
/*public key:*/ "020e8767c081c4c37b88a3bee1d0a726f88a5530ea8f8a63221b8e34e7066b0e01": 75 , // Private Key: 214f36fd9ccb8c1cff2665d4f808a0d2227efbb6a7c3c3ac935bbad8f2ba75d0
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
        console.log(`Address: ${address}, Balance: ${balance}`);
  res.send({ balance });
});

app.post("/send", async (req, res) => { 
  const { sender, recipient, amount, signature } = req.body;  
  

if (!verify(signature, "transfer", sender)) {
  return res.status(400).send({ message: "You are not the account owner!" });
}

setInitialBalance(sender);
setInitialBalance(recipient);

if (balances[sender] < amount) {
  return res.status(400).send({ message: "Not enough funds!" });
}
  balances[sender] -= amount;
  balances[recipient] += amount;
  return res.send({ balance: balances[sender] });
  
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
