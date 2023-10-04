import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({
  // address,
  // setAddress,
  // balance,
  // setBalance,
  //privateKey,
  //setPrivateKey,
  messageHash,
  setMessageHash,
  signature,
  setSignature,
}) {
  async function onChange(evt) {
    const messageHash = evt.target.value;
    setMessageHash(messageHash);

    const signature = evt.target.value;
    setSignature(signature);

    //const address = toHex(secp256k1.getPublicKey(privateKey));
    //const address = secp256k1.getPublicKey(privateKey); b

    // Don't set adddress at client side
    /* 
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    } */
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Message Hash
        <input
          placeholder="Paste the message hash"
          value={messageHash}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Signature Key
        <input
          placeholder="Paste the Singnature here"
          value={signature}
          onChange={onChange}
        ></input>
      </label>
    </div>
  );
}

export default Wallet;

/*
address and balance 
 <div>Address : 0x{address.slice(0, 100)}...</div>
      <div className="balance">Balance: {balance}</div>
    
*/
