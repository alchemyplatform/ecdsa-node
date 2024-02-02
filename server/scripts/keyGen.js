function keyGenerator() {
    const { secp256k1 } = require('ethereum-cryptography/secp256k1')
    const { toHex } = require('ethereum-cryptography/utils')

    const privateKey = secp256k1.utils.randomPrivateKey()
    const publicKey = secp256k1.getPublicKey(privateKey)

    console.log("Private Key: ", toHex(privateKey))
    console.log("Public Key: ", toHex(publicKey))

    return toHex(publicKey)
}

module.exports.keyGenerator = keyGenerator