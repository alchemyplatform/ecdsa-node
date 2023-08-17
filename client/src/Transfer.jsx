import React, { useState } from "react"; // Обратите внимание на добавление React
import { arr } from "../../server/scripts/accounts_array.js";
import  Operation  from "../../server/scripts/balance_operation.js";
import Wallet from "./Wallet.jsx";
 const Transfer = ({ senderAddress }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  //const [senderAddress, setAddress] = useState(address);
  const [senderBalance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    CheckSenderAddressValidity();
  }

  const CheckSenderAddressValidity = () => {
    try {
      let validRecipient = false; 
      for (var i = 0; i < arr.length; i++) {
        if (recipient === arr[i].address) {
          validRecipient = true; 
          setBalance(arr[i].balance);
          //setAddress(address); //встановити адресу з файлу волет 
          setRecipient(arr[i].address); //встановити адресу яку вводить користувач 
          setErrorMessage(""); 
          CallBalanceChange(sendAmount, senderAddress, recipient);
          break;
        }
      }
      if (!validRecipient) {
        setErrorMessage("Invalid recipient address"); // Устанавливаем ошибку, если адрес неправильный
      }
    } catch (error) {
      setErrorMessage("Something went wrong: " + error.message);
    }
  };
  const CallBalanceChange=(sendAmount,senderAddress,recipient)=>{
    console.log("CallBalanceChange function called");
    console.log("sendAmount:", sendAmount);
    console.log("senderAddress:", senderAddress);
    console.log("recipient:", recipient); 


    const operationInstance = new Operation();
    const recipientObj = operationInstance.RecipientChange(recipient);
    const senderObj = operationInstance.SenderChange(senderAddress);
    const updatedRecipientBalance = operationInstance.updateBalanceForRecipient(recipientObj,sendAmount);
    const updatedSenderBalance = operationInstance.updateBalanceForSender(senderObj,sendAmount);
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
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
  type="submit"
  className="button"
  value="Transfer"
  onClick={() => CallBalanceChange(sendAmount, senderAddress, recipient)}
/>
    </form>
  );
}

export default Transfer;
