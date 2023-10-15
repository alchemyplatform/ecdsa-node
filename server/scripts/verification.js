import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { HashMessage } from "./HashMessage.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { hexToBytes, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { toHex } from "ethereum-cryptography/utils.js";



export function veryfication(makeSign,recipientAddress,senderAddress,Amount,publicKey) {
    const msgHash = HashMessage(recipientAddress,senderAddress,Amount);
    const validation  = new secp256k1.Signature(makeSign.r,makeSign.s,makeSign.recovery);
    let sign = validation.recoverPublicKey(msgHash,makeSign,makeSign.recovery);
    const validity = secp256k1.verify(validation,msgHash,publicKey);
    console.log(sign);
    console.log(validation)
    console.log(validity);
    return validity;
}

