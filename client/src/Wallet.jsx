import server from "./server";
// import * as secp from "ethereum-cryptography/secp256k1";
// const { keccak256 } = require("ethereum-cryptography/keccak");
// const { utf8ToBytes } = require("ethereum-cryptography/utils");
// const hashMessage = require('./hashMessage');

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Check your Wallet Balance</h1>

      <label>
        Wallet Address
        <input placeholder="Enter your public address to check your balance" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
