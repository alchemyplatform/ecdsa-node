import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [messageHash, setMessageHash] = useState("");

  /* A helper function setValue is defined, which returns a function that,
   when called with an event evt, calls the provided setter function with 
   the value of the event target. This function simplifies the process of 
   updating state based on user input. */
  const setValue = (setter) => (evt) => setter(evt.target.value);

  /* Async Function transfer: The transfer function is defined to handle 
  form submission. It prevents the default form submission behavior using 
  evt.preventDefault(). It tries to send a POST request to the /send endpoint 
  on the server with the sender's address, amount to send, and recipient address 
  as the request body. If the request is successful, it updates the balance using 
  the setBalance function passed as a prop. If there's an error during the request,
  it alerts the user with the error message.
  */
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        //sender: address,
        sender: signature,
        amount: parseInt(sendAmount),
        recipient,
        messageHash,
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

      <label>
        Signature
        <input
          placeholder="Type a signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Message Hash
        <input
          placeholder="Type a message hash"
          value={messageHash}
          onChange={setValue(setMessageHash)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
