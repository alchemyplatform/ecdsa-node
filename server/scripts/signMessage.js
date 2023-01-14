const secp = require("ethereum-cryptography/secp256k1")
const { keccak224 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const prompt = require("prompt-sync")()

const amount = prompt("How much are you sending? : ")
// const recipient = prompt("What is the address of the recipient? : ")
const privateKey = prompt("Please input your private key : ")

// const pubKey = secp.getPublicKey(secp.utils.hexToBytes(privateKey))

console.log("Signing transaction")
const txData = {
    "amount": parseInt(amount),
}
const txDataHash = keccak224(utf8ToBytes(JSON.stringify(txData)))
const privateKeyBytes = secp.utils.hexToBytes(privateKey)

async function signMessage(hashedMessage, privKey) {
    const signature = await secp.sign(hashedMessage, privKey, { "recovered": true })
    return signature
}

signMessage(txDataHash, privateKeyBytes).then(
    (res) => {
        console.log("Signature: " + toHex(res[0]))
        console.log("Recovery: " + res[1])
    }, 
    (err) => {
        console.log("Failed to sign transaction")
    }
)
