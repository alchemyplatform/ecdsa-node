const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const fs = require('fs')

function hashMessage(message) {
    const bytesMessage = utf8ToBytes(message);
    const hashMsg = keccak256(bytesMessage);

    return hashMsg;
}

const messageHash = toHex(hashMessage('MyWallet'));

fs.writeFileSync('Wallets.txt', '', (err) => {
    if (err) throw err;
});

for (let i = 0; i < 5; i++) {
    privateKey = secp256k1.utils.randomPrivateKey();
    var publicKey = secp256k1.getPublicKey(privateKey);
    var publicKeyHash = keccak256(publicKey.slice(1));
    var address = publicKeyHash.slice(publicKeyHash.length - 20);
    var signMessage = secp256k1.sign(messageHash, privateKey).toCompactHex();

    fs.appendFileSync('Wallets.txt', `Wallet ${i}: ` + '\n', (err) => {
        if (err) throw err;
    });
    fs.appendFileSync('Wallets.txt', '\t Private: ' + toHex(privateKey) + ';' + '\n', (err) => {
        if (err) throw err;
    });
    fs.appendFileSync('Wallets.txt', '\t Public: ' + toHex(address) + ';' + '\n', (err) => {
        if (err) throw err;
    });
    fs.appendFileSync('Wallets.txt', '\t Signature: ' + signMessage + ';' + '\n', (err) => {
        if (err) throw err;
    });
}
