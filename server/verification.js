const { secp256k1 } = require("@noble/curves/secp256k1");
const { keccak_256 } = require("@noble/hashes/sha3");
const { utf8ToBytes } = require("@noble/hashes/utils");

const decoder = (key, value) => {
    if (key === "r" || key === "s") {
        return BigInt(value);
    }
    return value;
};

const getSignature = (signature) => {
    const sign = JSON.parse(signature, decoder);
    const construcSign = new secp256k1.Signature(sign.r, sign.s, sign.recovery);
    return construcSign;
};

const verify = (signature, message, publicKey) => {
    const sign = getSignature(signature);
    const hash = keccak_256(utf8ToBytes(message));
    return secp256k1.verify(sign, hash, publicKey);
};

module.exports = { verify };