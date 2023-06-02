import server from "./server";
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");



function Wallet({ address, setAddress, balance, setBalance ,privateKey, setprivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    const address = toHex(secp256k1.getPublicKey(privateKey));

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
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in your private key " value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        address: {address}
      </div>

      <div className="balance">balance: {balance}</div>
    </div>
  );
}

export default Wallet;
