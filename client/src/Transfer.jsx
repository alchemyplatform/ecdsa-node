import { useState } from "react";
import { ethers } from "ethers";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils"

import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [txObj, setTxObj] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Proceed only if address, recipient and sendAmount are valid
    if(ethers.isAddress(address) && ethers.isAddress(recipient) && sendAmount > 0){
      let from = address;
      let to = recipient;

      if(address.slice(0,2) === "0x"){
        from = address.slice(2);
      }
      if(recipient.slice(0,2) === "0x"){
        to = recipient.slice(2);
      }
      const tx = {
        sender: from,
        recipient: to,
        amount: parseInt(sendAmount)
      };
      setTxObj(tx);
      
      // Utilize ethers to prepare the transaction for signing
      const coder = ethers.AbiCoder.defaultAbiCoder();
      const encodedTx = coder.encode(
        ["address", "address", "uint256"],
        [tx.sender, tx.recipient, tx.amount]
      );
      //console.log("encodedTx:", encodedTx);

      // Create a hash of the encoded transaction
      const hashedEncodedTx = ethers.keccak256(encodedTx);
      //console.log("hashedEncodedTx:", hashedEncodedTx);

      // Sign the hash of the encoded transaction
      const signature = secp256k1.sign(hashedEncodedTx.slice(2), privateKey);
      //console.log("signature:", signature);

      // The signature obtained from secp256k1.sign() is an object with three properties: r, s, and recovery
      // which unfortunately contains BigInts. Convert them to string before sending to the server
      // Unfortunately signature instance will loose its characteristics when converted with JSON.stringify()
      const signatureString = JSON.stringify({
        r: signature.r.toString(),
        s: signature.s.toString(),
        recovery: signature.recovery.toString()
      });
      //console.log("signatureString:", signatureString);

      const publicKey = secp256k1.getPublicKey(privateKey);
      const hexPublicKey = toHex(publicKey);

      // Verify the signature
      //const isSigned = secp256k1.verify(signature, hashedEncodedTx.slice(2), hexPublicKey);
      //console.log("isSigned:", isSigned);

      try {
        const {
          data: { balance },
        } = await server.post(`/transfer`, {
          from: tx.sender,
          to: tx.recipient,
          amount: parseInt(sendAmount),
          signatureString: signatureString,
          hexPublicKey: hexPublicKey
        });
        setBalance(balance);
        console.log("Transaction executed successfully. New balance:", balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    } else {   
      alert("Please enter a valid address and amount");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1 Ξ"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="0x..."
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Transaction object
        <textarea
          value={JSON.stringify(txObj, null, 2)}
          readOnly
          height={txObj ? txObj.length : 0}
        ></textarea>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;