import{ arr} from "./accounts_array.js";

export const addressPubKey = [];

export const Authentificator = async (newAddress, newPublicKey) => {
     let pushToAddressPK = arr
        .filter(item => item.address === newAddress && item.publicKey === newPublicKey)
        .map(item => ({ address: item.address, publicKey: item.publicKey }));
        
    if (pushToAddressPK.length > 0) {
        pushToAddressPK ={
            address: newAddress,
            publicKey: newPublicKey
        }
        console.log(`Public key is valid`);
        console.log(pushToAddressPK);
    } else {
        console.log(`public key is unvalid`);
        return [];
    }
    addressPubKey.push(pushToAddressPK);
    console.log(addressPubKey);
    return pushToAddressPK;
};
