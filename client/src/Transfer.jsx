import { useState } from "react";
import server from "./server";
import { sign } from "ethereum-cryptography/secp256k1";
import { toBuffer, toHex } from "ethereum-cryptography/utils";
import { Buffer } from "buffer";
import secp256k1 from "ethereum-cryptography/secp256k1";


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    console.log("sendAmount type:", typeof sendAmount);
    console.log("sendAmount value:", sendAmount);
  
    const sendAmountStr = String(sendAmount);
    console.log("sendAmountStr type:", typeof sendAmountStr);
    console.log("sendAmountStr value:", sendAmountStr);
  
    const messageHash = Buffer.from(`send ${sendAmountStr} to ${recipient}`, "utf8");

    // Generate the signature
    const privateKeyBuffer = Buffer.from(privateKey, "hex"); // Convert the private key to a Buffer object
    const signature = sign(messageHash, privateKeyBuffer);
    const signatureBuffer = Buffer.from(signature, "hex"); // Convert the signature to a Buffer object
    const r = signatureBuffer.slice(0, 32);
    const s = signatureBuffer.slice(32, 64);
    const v = signatureBuffer[64] + 27;
    const sender = secp256k1.publicKeyCreate(privateKeyBuffer, true);
  
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: toHex(sender),
        amount: parseInt(sendAmount),
        recipient,
        v: toHex(v),
        r: toHex(r),
        s: toHex(s),
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Private Key
        <input
          placeholder="Enter your private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
