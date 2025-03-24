import { addressPubKey } from "./authentificator.js";

export const RecipientPubK = (addressRecipient)=>{
    const recipientPubKeyPairs = addressPubKey.filter(item => item.address === addressRecipient);
    console.log(recipientPubKeyPairs);
    return recipientPubKeyPairs;
}