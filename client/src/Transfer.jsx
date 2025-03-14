import React, { useState } from "react";
import { keccak_256 } from "@noble/hashes/sha3";
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = (message) => {
    const bytes = utf8ToBytes(message);
    const hash = keccak_256(bytes);
    return hash;
  };

  const signMessage = (message, privateKey) => {
    const signed = secp256k1.sign(hashMessage(message), privateKey);
    return signed;
  };

  const jsonReplacer = (key, value) => typeof value === "bigint" ? value.toString() : value;

  async function transfer (evt) {
    evt.preventDefault();

    const senderSignature = signMessage("transfer", privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: JSON.stringify(senderSignature, jsonReplacer)
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
          placeholder="Type in a public key..."
          value={recipient}
          onChange={setValue(setRecipient)} 
        ></input>
      </label>

      <input 
      type="submit" 
      className="button" 
      value="Transfer" />
    </form>
  );
}


export default Transfer;
