import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [messageHash, setSendAmount] = useState("");
  const [signature, setSign] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setAmount] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        messageHash,
        signature,
        recipient,
        amount: parseInt(sendAmount)
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
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Amount
        <input
          placeholder="Enter Amount here"
          value={sendAmount}
          onChange={setValue(setAmount)}
        ></input>
      </label>

      <label>
        MessageHash
        <input
          placeholder="Enter Message Hash"
          value={messageHash}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Signature Here"
          value={signature}
          onChange={setValue(setSign)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
