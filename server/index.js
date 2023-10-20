const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1271361771672173417910594129192121161221125186109148242152": 100,
  "0x38229103182971522405321992171982511147202244171240225": 50,
  "0x78185871822541684025244200121451103316046106144245113": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { privKey, recipient, amount } = req.body;

  try {
    address = getAddressFromPrivKey(privKey);

    setInitialBalance(address);
    setInitialBalance(recipient);

    if (balances[address] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[address] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[address] });
    }
  } catch (error) {
    res.status(400).send({ message: "Something is wrong with the private key. Try again." });
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

function getAddressFromPrivKey(privKey) {
  const pubKey = secp.secp256k1.getPublicKey(privKey);
  const address = '0x' + keccak256(pubKey.slice(1)).slice(-20).join('');
  return address;
}
