const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "709701284bfe051e877a9aa216ddab7876127441": 100,
  "0862a3d688b75242b710977299f343453e5cf082": 50,
  "55abbbf5177640b7241f6eeb2e4174acbbe44413": 75,
  "b6d01fada5df2e963c888f645742c3fb76da1fd2": 1000,
  "8990e147072b8227e0d028630ff4fbf256cae484": 1000,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/verify", (req, res) => {
  const { signature, address } = req.body;

  if (verifySignature(signature, address)) {
    res.send({ isValid: 'Success!' });
  } else {
    res.send({ isValid: 'Signature is not valid!' });
  }
});

app.post("/send", (req, res) => {
  const { signature, sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!verifySignature(signature, sender)) {
    res.status(400).send({ message: "Signature is not valid!" });
  } else if (balances[sender] < amount) {
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

function verifySignature(signature, address) {
  const messageHash = '5c8954ab49883c5b77e0f0a6e4b94c630a94e1eecf7771c5e267e5dffd9e2153'; // keccak256 from 'MyWallet'
  try {
    const sig = secp256k1.Signature.fromCompact(signature);
    for (let i = 0; i < 4; i++) {
      let publicKey = sig.addRecoveryBit(i).recoverPublicKey(messageHash).toRawBytes();
      let publicKeyHash = keccak256(publicKey.slice(1));
      let recoveredAddress = toHex(publicKeyHash.slice(publicKeyHash.length - 20));
      if (recoveredAddress === address) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
