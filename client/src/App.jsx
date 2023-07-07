import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Faucet from "./Faucet";
import "./App.scss";
import { useState, useEffect } from "react";

import server from "./server";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [nonce, setNonce] = useState("N/A");

  /**
   * Load initial faucet balance from server
   */
  useEffect(() => {

    async function getFaucetBalance(){
      const {
        data: { faucetBalance },
      } = await server.get(`/faucetBalance`);
      setFaucetBalance(faucetBalance);
    };

    getFaucetBalance();

  }, [setFaucetBalance]);

  return (
    <div className="app">
      <Faucet
        address={address}
        faucetBalance={faucetBalance}
        setFaucetBalance={setFaucetBalance}
      />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
        faucetBalance={faucetBalance}
        nonce={nonce}
        setNonce={setNonce}
      />
      <Transfer 
        address={address}
        setBalance={setBalance}
        privateKey={privateKey}
        nonce={nonce}
      />
    </div>
  );
}

export default App;