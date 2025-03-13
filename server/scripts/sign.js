const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const privateKey = '415c6f7338bd49f8fd79b4d41d50f372d4a80db4f70ebfe308df11cd0f144195';
const messageHash = 'f26fe5bdfd6aab8ba475e57d006a1d3fae0759e7415f13a13b6ac9cf267307d9';

const signature = secp256k1.sign(messageHash, privateKey);
console.log(signature.toCompactHex());