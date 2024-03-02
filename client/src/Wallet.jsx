import React from 'react';
import { ethers } from 'ethers';
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKeyInput = evt.target.value;
    setPrivateKey(privateKeyInput);

    try {
      // Create a new Wallet instance using the private key
      const wallet = new ethers.Wallet(privateKeyInput);

      // The address is readily available in the Wallet instance
      const newAddress = wallet.address;
      console.log('Address:', newAddress);
      setAddress(newAddress);

      if (newAddress) {
        // Assuming server.get is an API call to get the balance
        const {
          data: { balance },
        } = await server.get(`balance/${newAddress}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error('Error generating public key:', error);
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private key
        <input
          placeholder="Type a private key, for example: b1a8527873d6b62a786ab65d59da195c6c4a102a9abd96186b69c40407d2f0d9"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>
        Address: {address}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
