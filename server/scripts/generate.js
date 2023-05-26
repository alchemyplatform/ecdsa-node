import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key: ', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

console.log('publicKey key: ', toHex(publicKey));