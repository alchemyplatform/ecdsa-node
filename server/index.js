const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1")
const { keccak224 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "d0c2188fe7ed67fe888c56c5a8e56f1f9576e668": 100,
  "2fd5d8f5a3c4c4fd0ec636ac56afd0f80a9926ff": 50,
  "fcf3aa09cf11b6275cb294afc4281ea18e539927": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const txData = {
    "amount": parseInt(amount)
  }
  const txDataHash = keccak224(utf8ToBytes(JSON.stringify(txData)))
  const signatureBytes = secp.utils.hexToBytes(signature)

  // Public key from signature
  const recoveredPubKey = secp.recoverPublicKey(txDataHash, signature, recovery)
  const preformatRecoveredAddress = recoveredPubKey.slice(1)
  const recoveredAddress = keccak224(preformatRecoveredAddress).slice(-20)

  if (balances[sender] < amount) {
    console.log("Failed because of insufficient funds")
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    console.log("Starting signature verification")
      // Compare the public keys
    if (toHex(recoveredAddress) !== sender) {
      console.log("Sender did not sign transaction")
      res.status(400).send({ message: "Sender did not sign transaction" })
    }
    else if (secp.verify(signatureBytes, txDataHash, recoveredPubKey)) {
      console.log("Verified signature...")
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    } else {
      console.log("Failed to verify message")
      res.status(400).send({ message: "Verification failed"})
    }
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
