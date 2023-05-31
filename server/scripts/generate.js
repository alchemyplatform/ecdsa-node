const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils")

// const privatekey = toHex(secp.secp256k1.utils.randomPrivateKey());
const privatekey = "2b584df48dcf617b6a695c4cf472a0bd255c873c61b26c39be36de3649a1ca23"
const privateKeyBytes = new Uint8Array(privatekey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
console.log("//",privateKeyBytes);

const publickey = toHex(secp.secp256k1.getPublicKey(privatekey)); 
console.log(publickey);

const { createPrivateKeySync, ecdsaSign } = require("ethereum-cryptography/secp256k1-compat");
const msgHash = Uint8Array.from(
  "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28",
  "hex"
);
const privateKey = createPrivateKeySync();
console.log(Uint8Array.from(ecdsaSign(msgHash, privateKey).signature));