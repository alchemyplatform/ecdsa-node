import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import { getRandomBytesSync } from "ethereum-cryptography/random.js";

export const AddressConfig = {
     privatKeyGen (privateKey){
        return privateKey = toHex(secp256k1.utils.randomPrivateKey());
    },
     addressGen (address){
        return address = toHex(getRandomBytesSync(20));
    },
    balanceLog (){
        return 100;
    },
    publicKeyGen (publicKey){
        return publicKey = toHex(secp256k1.getPublicKey(this.privatKeyGen()));
    }

}
export default class bebra{
    constructor(a){
    this.a = a;
    }
}

    //  console.log(AddressConfig.addressGen());
    //  console.log(AddressConfig.balanceLog());
    //  console.log(AddressConfig.privatKeyGen());
    //  console.log(AddressConfig.publicKeyGen());


