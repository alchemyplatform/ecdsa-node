import server from "./server";
import {toHex} from 'ethereum-cryptography/utils';
import {keccak256} from 'ethereum-cryptography/keccak';
import * as secp from 'ethereum-cryptography/secp256k1';

function Wallet({ privateKey, setPrivateKey, balance, setBalance, address, setAddress }) {
  async function onChange(evt) {
    const pk = evt.target.value;
    let address = '';
    setPrivateKey(evt.target.value);
    if (pk.length === 64) {
      try {
        const pubKey = secp.getPublicKey(pk);
        address = '0x' + toHex(keccak256(pubKey).slice(-20));
        setAddress(address);
      } catch (error) {
        setAddress("");
      }
    } else {
      setAddress("");
    }

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
        Wallet Private Key
        <input placeholder="Type an private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
