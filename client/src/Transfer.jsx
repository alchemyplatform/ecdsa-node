import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  function hashMessage(message){
    return toHex(keccak256(utf8ToBytes(message)));
  }
  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      address, sendAmount, recipient,
    };

    const hash = hashMessage(JSON.stringify(message));
    const [sig, recoveryBit] = await secp.sign(hash, privateKey, {recovered: true});
    message.sign = toHex(sig);
    message.recoveryBit = recoveryBit;
    setSignature(toHex(sig));
    setRecoveryBit(recoveryBit);
    console.log('request:', message);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
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
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <div>
        Signature: {signature}
      </div>
      <div>
        Recovery Bit: {recoveryBit}
      </div>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
