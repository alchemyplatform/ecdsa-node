import { getRandomBytesSync } from "ethereum-cryptography/random.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils.js"
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [signature, setSignature] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isValid, setValid] = useState("");
  const [txMessage, setTxMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const transferButton = document.getElementById("transferButton");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        txHash,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  function CreateTransaction(evt) {
    evt.preventDefault();
    transferButton.disabled = true;

    const salt = toHex(getRandomBytesSync(32));
    const txMessage = recipient + ':' + sendAmount + ':' + salt;
    const txHash = toHex(keccak256(utf8ToBytes(txMessage)));
    setTxMessage(txMessage);
    setTxHash(txHash);
  }

  function verification(evt) {
    const signature = evt.target.value;
    setSignature(signature);

    if (signature) {
      try {
        const sig = secp256k1.Signature.fromCompact(signature);
        for (let i = 0; i < 4; i++) {
          let publicKey = sig.addRecoveryBit(i).recoverPublicKey(txHash).toRawBytes();
          let publicKeyHash = keccak256(publicKey.slice(1));
          let recoveredAddress = toHex(publicKeyHash.slice(publicKeyHash.length - 20));
          if (recoveredAddress === address) {
            setValid('Approved');
            transferButton.disabled = false;
            break;
          }
        }
      } catch {
        setValid('Signature is not valid');
        transferButton.disabled = true;
      }
    } else {
      setValid("Undefined");
      transferButton.disabled = true;
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

      <input type="button" className="button" value="Create Transaction" onClick={CreateTransaction} />
      <div className="transaction">
        <div className="up">Transaction: </div>
        <div className="low">{txMessage}</div>
      </div>
      <div className="transaction">
        <div className="up">Transaction hash: </div>
        <div className="low">{txHash}</div>
      </div>

      <label>
        Verify
        <input
          placeholder="hex signature"
          value={signature}
          onChange={verification}
        ></input>
      </label>

      <div className="Verification">Verification status: {isValid}</div>

      <input type="submit" disabled id="transferButton" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
