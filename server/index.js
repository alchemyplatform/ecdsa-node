const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "a17dc0fa60592e4c7ef410dde0b38dc0e75814e3": 100,
  "bc6a84b7dce3e64a0b4c29e74184735192157d29": 50,
  "c6f9462fe05aa3057f171b8049d1ff846ea6620b": 75,
};
  

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: signature and message
  const { sender, recipient, amount, sign, recoveryBit } = req.body;
  const message = {sender, amount,recipient};
  const messageHash = hashMessage(JSON.stringify(message));
  const recovered = secp.recoverPublicKey(messageHash, hexToBytes(sign), recoveryBit);

  const addressOfSign = toHex(addressFromPublicKey(recovered));
  console.log('addressOfSign:',addressOfSign);

  setInitialBalance(sender);
  setInitialBalance(recipient);
  if(sender!==addressOfSign){
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      console.log("Public Key Verified");
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
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
function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}
function addressFromPublicKey(publicKey){
  const addrBytes = publicKey.slice(1);
  const hash = keccak256(addrBytes);
  return hash.slice(-20);
}