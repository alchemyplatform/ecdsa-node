// Wallet.jsx
import React, { useState } from "react";
import { LogInComponent } from "./LogInPage";
import { arr } from "../../server/scripts/accounts_array.js";
import { Authentificator } from "../../server/scripts/authentificator.js";
import { RecipientPubK } from "../../server/scripts/recipient_pub_key.js";
import "./Wallet.scss";

const Wallet = ({ onLogin }) => {
  // State variables for managing user data
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // Handles user login and updates state
  const handleLogin = (address, balance, newPrivateKey, newPublicKey) => {
    setAddress(address);
    setBalance(balance);
    setPrivateKey(newPrivateKey);
    setPublicKey(newPublicKey);
    onLogin(address, balance, newPublicKey);
  };

  // Handles changes to user address input field
  const handleAddressChange = (evt) => {
    setAddress(evt.target.value);
  };

  // Handles changes to public key input field
  const handlePublicKeyChange = (evt) => {
    const newPublicKey = evt.target.value;
    setPublicKey(newPublicKey);
    const isAuthorized = Authentificator(address, newPublicKey);
    // Do something with isAuthorized
  };

  // Checks and updates user balance
  const handleCheckBalance = () => {
    const foundUser = findUserByAddress(address);
    if (foundUser) {
      setBalance(foundUser.balance);
    } else {
      setBalance(0);
      alert("Address not found");
    }
  };

  // Finds a user by their address in the accounts array
  const findUserByAddress = (address) => {
    return arr.find((user) => user.address === address);
  };

  // Handles changes to recipient's public key input field
  const handleRecipientPublicKeyChange = (evt) => {
    const recipientPK = evt.target.value;
    setRecipientAddress(recipientPK);
    const foundRecipientPubK = RecipientPubK(recipientPK);
    // Do something with foundRecipientPubK
  };

  // JSX for the Wallet component
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <LogInComponent onLogin={handleLogin} />

      {/* User address input */}
      <input
        placeholder="Type an address, e.g., 0x..."
        type="text"
        onChange={handleAddressChange}
      />

      {/* User public key input */}
      <input
        placeholder="Type your public key, e.g., 765dhb..."
        type="text"
        onChange={handlePublicKeyChange}
      />

      {/* Display user balance */}
      <div className="balance">Balance: {balance}</div>

      {/* Button to check user balance */}
      <button className="button" onClick={handleCheckBalance}>Check Balance</button>

      <h3>Your Data</h3>
      <p>Keep your private key secret!</p>

      {/* Display user data */}
      <div className="usersData">
        <p>Address: {address}</p>
        <p>Balance: {balance}</p>
        <p>Public Key: {publicKey}</p>
        <p>Private Key: {privateKey}</p>
      </div>

      {/* Input for recipient's public key */}
      <div className="recipientPublicKey">
        <input
          placeholder="Type an address, e.g., 0xwad..."
          type="text"
          onChange={handleRecipientPublicKeyChange}
        />
        {/* Button to perform recipient public key related action */}
      </div>
    </div>
  );
};

export default Wallet;
