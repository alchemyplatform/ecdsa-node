import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [loggedInAddress, setLoggedInAddress] = useState(""); 
  const [loggedInBalance, setLoggedInBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");

  const handleLogin = (address,balance,newPublicKey) => {
    setLoggedInAddress(address);
    setLoggedInBalance(balance);
    setPublicKey(newPublicKey);
  };
  const handleAddressChange = (address) => {
    setLoggedInAddress(address);
  };
  return (
    <div className="app">
     <Wallet onLogin={handleLogin} />

     <Transfer senderAddress={loggedInAddress} publicKey={publicKey}/>
 
    </div>
  );
}

export default App;
