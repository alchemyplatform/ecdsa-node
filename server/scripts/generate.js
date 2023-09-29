const secp = require('ethereum-cryptography/secp256k1')
const {toHex} = require('ethereum-cryptography/utils')

const privateKey = secp.secp256k1.utils.randomPrivateKey()
console.log("Private Key: ",toHex(privateKey))
const publicKey = secp.secp256k1.getPublicKey(privateKey)
console.log("Public Key: ",toHex(publicKey))


/*     Private Key:  c8fb3df36317cc162e09a9f47b7efad25d669fc08ccda014b222ba600c884dff
Public Key:  030a516fbcb67b1fe1cbd06f89bf1972d46efe12583d6bb759d8ac62f017b37b8b
PS C:\Users\Admin\Documents\week1\week1\server> node scripts/generate.js
Private Key:  4d81bbe416bb3d134b9f453553fac9d1a1fd5373014abbea87d43f505c9e12d8
Public Key:  034633f85e62385ae67846e10a2f676054e1708b600fc71f7207a38fff22be4fd0
PS C:\Users\Admin\Documents\week1\week1\server> node scripts/generate.js
Private Key:  9794de0cfa67c300376bc1c006caab68caeb67ddf6750e08b3fc25b707731c7c
Public Key:  02e47ac1ff6eee8067bb631666a796a97a175db1beae3975f8929e5f4405fb5369        */