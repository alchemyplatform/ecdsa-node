import { useState } from "react";
import server from "./server";
import * as secp from '@noble/secp256k1';
import { keccak224 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Create a transaction object
    const txData = {
      "sender": address,
      "amount": parseInt(sendAmount),
      "recipient": recipient
    }

    // Hash tx object
    const txDataHash = keccak224(utf8ToBytes(JSON.stringify(txData)))

    // Sign the tx hash with private keys
    const privKeyBytes = secp.utils.hexToBytes(privateKey)
    const signature = await secp.sign(txDataHash, privKeyBytes, { "recovered": true })

    // Get the public key for the sender
    const pubKey = secp.getPublicKey(privKeyBytes)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        signature: toHex(signature[0]),
      });
      setBalance(balance);
    } catch (ex) {
      console.log(JSON.stringify(ex))
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Private Key 
        <input
          placeholder="private key"
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
