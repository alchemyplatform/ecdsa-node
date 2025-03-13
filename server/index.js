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
  "2c66c985fa79c326a669e1d282737a0ada49cab9": 100,
  "87a4bc900a35dfc47df11719045c26dc34fc2df4": 50,
  "c0cbb5992f0825f389084400f59f3686bc713822": 75,
  "7dd8df87cca8a988fffd302e7c8486e90f4e6695": 1000,
  "3777d9a62dbde165d771448a8d9bed685511ec3f": 1000,
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
  const { sender, recipient, amount, txHash, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!verifySignature(signature, sender, txHash)) {
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

function verifySignature(signature, address, messageHash) {
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
