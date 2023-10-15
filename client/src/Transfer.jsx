import React, { useState,useEffect } from "react"; // Обратите внимание на добавление React
import { arr } from "../../server/scripts/accounts_array.js";
import  Operation  from "../../server/scripts/balance_operation.js";
import { veryfication } from "../../server/scripts/verification.js";
import { Sign } from "../../server/scripts/Signification.js";
import  { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { toHex } from "ethereum-cryptography/utils.js";



 const Transfer = ({ senderAddress,publicKey }) => {
  const [sendAmount, setSendAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [senderBalance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
 
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
          setRecipient(arr[i].address); //встановити адресу яку вводить користувач 
          setErrorMessage(""); 
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
  const CallBalanceChange = (sendAmount, senderAddress, recipient) => {
    console.log("CallBalanceChange function called");
    console.log("sendAmount:", sendAmount);
    console.log("senderAddress:", senderAddress);
    console.log("recipient:", recipient);

    const operationInstance = new Operation();
    const recipientObj = operationInstance.RecipientChange(recipient);
    const senderObj = operationInstance.SenderChange(senderAddress);
    const updatedRecipientBalance = operationInstance.updateBalanceForRecipient(recipientObj, sendAmount);
    const updatedSenderBalance = operationInstance.updateBalanceForSender(senderObj, sendAmount);
    console.log(updatedRecipientBalance);
    console.log(updatedSenderBalance);
  };
  const handleOptionChange = (privateKey) => {
    if (isChecked) {
      return Sign(recipient,senderAddress,sendAmount,privateKey);
    }
  };
 const verify =()=>{
    const isVeryfied = veryfication(handleOptionChange(privateKey),recipient,senderAddress,sendAmount,publicKey);
    return isVeryfied;
 }
  useEffect(() => {
    if (isChecked) {
      handleOptionChange(privateKey);
    }
    
  }, [isChecked, privateKey]);
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
      <div>
      <div>
      <label>
       
        <input
          placeholder="Type your private key to make a sign"
          value={privateKey}
          onChange={(evt) => setPrivateKey(evt.target.value)}
        />
         <input
          type="checkbox"
          checked={isChecked}
          onChange={(evt) => {
            setIsChecked(evt.target.checked);
          }}
          
        />
        <h3>Press for sing </h3>
      </label>
    </div>
  <p>Стан чекбокса: {isChecked ? "Обрано" : "Не обрано"}</p>
</div>
      <input
  type="submit"
  className="button"
  value="Transfer"
  onClick={() => CallBalanceChange(sendAmount, senderAddress, recipient)}
/>
<div className="verification">
  <button
    onClick={verify}>
    Verification
  </button>
</div>

    </form>
  );
}

export default Transfer;
