import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { HashMessage } from "./HashMessage.js";


export function Sign (recipientAddress,senderAddress,Amount,privateKey){
    const msgHash = HashMessage(recipientAddress,senderAddress,Amount);
    const sign = secp256k1.sign(msgHash,privateKey)

    return sign;
}