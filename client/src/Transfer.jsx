import { useState } from "react";
import server from "./server";
import { ethers } from 'ethers';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!privateKey) {
      alert("No private key provided.");
      return;
    }

    try {

      const wallet = new ethers.Wallet(privateKey);

      const message = `Transfer ${sendAmount} to ${recipient}`;
      const flatSig = await wallet.signMessage(message);
      console.log('flatSig');
      console.log(flatSig);
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: flatSig,
      });
      setBalance(balance);
    } catch (ex) {
      alert("Error during transfer: " + (ex.response?.data?.message || ex.message));
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

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
