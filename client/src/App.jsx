import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";


function App() {
  const [loggedInAddress, setLoggedInAddress] = useState(""); 
  const [loggedInBalance, setLoggedInBalance] = useState(0);

  const handleLogin = (address,balance) => {
    setLoggedInAddress(address);
    setLoggedInBalance(balance);
  };
  const handleAddressChange = (address) => {
    setLoggedInAddress(address);
  };
  return (
    <div className="app">

    <Wallet onLogin={handleLogin} onAddressChange={handleAddressChange} />
       <Transfer 
      //  balance={loggedInBalance} 
       senderAddress={loggedInAddress} />  
    </div>
  );
}

export default App;
