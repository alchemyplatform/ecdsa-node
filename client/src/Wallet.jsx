import server from "./server";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/hashes/utils";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  
  async function onChange(evt) {

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = bytesToHex(secp256k1.getPublicKey(privateKey));
    setAddress(address);

if (address) {
  const {
    data: { balance },
  } = await server.get(`balance/${address}`);
  setBalance(balance);
} else {
  setBalance(0);
  }
}

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input 
        placeholder="Type in a private key..." 
        value={privateKey} 
        onChange={onChange}
        ></input>
      </label>

      <div>
        Public Key: {address ? 
        address.slice(0, 10) + "..." + address.slice(-10) :
         "Invalid address"} 
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}
 export default Wallet;
