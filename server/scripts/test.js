const secp = require("ethereum-cryptography/secp256k1")
const { keccak224 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")

// Generate private key
var privateKey = secp.utils.randomPrivateKey() // Uint8Array
var privateKeyStr = secp.utils.bytesToHex(privateKey) // str
console.log("Private key: " + privateKeyStr)

// Generate public key
var publicKey = secp.getPublicKey(privateKey) // Uint8Array
var publicKeyStr = secp.utils.bytesToHex(publicKey) // str
console.log("Public key: " + publicKeyStr)

// Convert public key to an ETH equivalent
var hashedPubKey = toHex(keccak224(publicKey))
console.log("Public key: " + hashedPubKey)

// Create new transaction message
const newTransaction = { 
    "receiver": "some address",
    "amount": 10
}
const newTransactionStr = JSON.stringify(newTransaction)
const msgHash = keccak224(utf8ToBytes(newTransactionStr))

// Sign with private key and verify that the message is signed
async function signMessage(hashedMessage) {
    return await secp.sign(hashedMessage, privateKey, { "recovered": true })
}
signMessage(msgHash).then(
    (res) => {
        console.log("Signature: " + secp.utils.bytesToHex(res[0]))
        const isVerified = secp.verify(res[0], msgHash, publicKey)
        console.log("isVerified: " + isVerified)
    },
    (err) => alert(err)
)

