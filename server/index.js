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
  "04417b6f32e5a6136cbd025aec2ac0089230b08d338708354aa9babfaf2009662150a34732c9e91f8794a99a8bf9981eabe40572fef86bd0d7e60b3fbeb28cb8a5": 100,
  "04d1f0a3db14faac1a186db07f0ce56f38b5ac24215c911c80ff432d3cdf363527ecbda5ce8d69995c958ee918814a3e992dde236352d99b281e90b144960ba4ef": 50,
  "04dd58123465df8813b308b35b8ab6614bb67e96a914304d585c87bf9fabdc39a22423dbd466a0a3a3c74b2166b6799965a13fc6db997301fae12fdca35dce8d33": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const txData = {
    "sender": sender,
    "amount": amount,
    "recipient": recipient
  }
  const txDataHash = keccak224(utf8ToBytes(JSON.stringify(txData)))
  console.log('TX Hahs server: ' + txDataHash)

  const signatureBytes = secp.utils.hexToBytes(signature)

  // Public key from signature
  const recoveredPubKey = secp.recoverPublicKey(txDataHash, signatureBytes, 0)
  console.log("Public key from signature: " + toHex(recoveredPubKey))
  console.log("Sender: " + sender)

  // Public key from predefined sender address
  const pubKeyBytes = secp.utils.hexToBytes(sender)  

  
  if (balances[sender] < amount) {
    console.log("Failed because of insufficient funds")
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    console.log("Starting signature verification")
      // Compare the public keys
    if (recoveredPubKey !== pubKeyBytes) {
      console.log("Sender did not sign transaction")
      res.status(400).send({ message: "Sender did not sign transaction" })
    }
    else if (secp.verify(signatureBytes, txDataHash, pubKeyBytes)) {
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
