const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xaf75bb1f9394fb90f0fcb3d81c614853ce565532": 100,
  "0xad59d00947b585fb088b73a99e9dcb19eb5b5ad3": 50,
  "0xd1f4c5983dd7b4914bf4b358ba03bed9a7c30769": 75,
  "0x1F0e2849cCbb64FB8C2333d3E8C754d516e1393C": 1000000
};

const addresstoKeys = {
  "0xaf75bb1f9394fb90f0fcb3d81c614853ce565532": '0455b80cce6d7f6f4b539875a3b41e6a46214bf5b948bb37b3554bbb3d55fb55f568585fc39fb5eb2762f94516a728faf4afa5d12bb718274e4c732bd2169841d2',
  "0xad59d00947b585fb088b73a99e9dcb19eb5b5ad3": '040413be4cc31d76806589548bbf69daaaa5d16c955e37dddc3d84538be74f6b83bec4d7ccdace9eed908e2e06f3b77573bb6d7ad85e4b56c8b8924cf9ab84ecce',
  "0xd1f4c5983dd7b4914bf4b358ba03bed9a7c30769": '04854e713394b15a311237c803f13e6317d9e2d805f4d7dfc673df9fc708164f7c8c1fa2c1ff3dbad3890620f9a8033fbf5b4ad8575688a5d025a588b2385f66f1',
}

const privateKeys = {
  "0xaf75bb1f9394fb90f0fcb3d81c614853ce565532": 'ccb545f1852443c5fbf0bad15b577a44b80ee225990a4a528f68873a690cf9f5',
  "0xad59d00947b585fb088b73a99e9dcb19eb5b5ad3": '5de3d631a95d6dba592ad1242b5c4132a7bb1f0e19efc53c460976be4d134511',
  "0xd1f4c5983dd7b4914bf4b358ba03bed9a7c30769": 'a00fec89aa7432eb8f1ef34ea899522bd024f77860ba78c28eb176c1b98401c3'
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] ?? 0;
  res.send({ balance });
});


app.post("/send", (req, res) => {
  const { sender, signature, messageHash, recipient, amount } = req.body;

  //const publicKey =  recoverKey('a5fafcee17ea0c7895fc3fca45cb495f958f024b3803baf98b0ce2f72f8e3c83', '30440220062cd9f1d64979531561730e1d4928ee32cb642c5841574aa81289b2dffff489022011b4b2da215b784b48f6cd8cd58e4f707f29e837b3d3a232c02e48f33ca43e8f1', 1);
  //const address = keyToAddress(publicKey);
  //let verify = verifyTrans('send', utf8ToBytes(sig), address);
  if (secp.verify(signature, messageHash, addresstoKeys[sender])){
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
  else{
    res.status(400).send({ message: "Some shit happened!" });
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

// Get the signature
// function hashMessage(message) {
//   const bytes = utf8ToBytes(message);
//   const hash = keccak256(bytes);
//   return hash;
// }

// async function signMessage(msg, privateKey) {
//   const messageHash = hashMessage(msg);
//   const signature = await secp.sign(messageHash, privateKey);
//   return ({ signature: toHex(signature[0]) + signature[1] })
// }
// Recover Public Address
//  function recoverKey(message, signature, recoveryBit) {
//   const messageHash = hashMessage(message);
//   return secp.recoverPublicKey(messageHash, signature, recoveryBit);
// }

/* to be used never
function verifyTrans(message, signature, address) {
 const messageHash = hashMessage(message);
 return secp.verify(signature, messageHash, address);
}
*/

function keyToAddress(privateKey){
  return '0x'+toHex(keccak256(secp.getPublicKey(privateKey).slice(1)).slice(-20))
}