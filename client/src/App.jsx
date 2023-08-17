import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import {LogInComponent} from "./LogInPage.jsx";

function App() {
  const [loggedInAddress, setLoggedInAddress] = useState(""); 
  const [loggedInBalance, setLoggedInBalance] = useState(0);

  const handleLogin = (address,balance) => {
    setLoggedInAddress(address);
    setLoggedInBalance(balance);
  };
  return (
    <div className="app">

      <Wallet address={loggedInAddress} balance={loggedInBalance} />
       <Transfer balance={loggedInBalance} address={loggedInAddress} />  
    </div>
  );
}

export default App;
