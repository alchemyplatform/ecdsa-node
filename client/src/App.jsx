import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import User from "./User.jsx"

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [loggedInUser, setLoggedInUser] = useState("");
    const [connectedWallet, setConnectedWallet] = useState("");

    return (
        <div className="app">
            <User
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
            />
            {/*<ConnectedWallet*/}
            {/*    connectedWallet={connectedWallet}*/}
            {/*    setConnectedWallet={setConnectedWallet}*/}
            {/*/>*/}
            <Wallet
                balance={balance}
                setBalance={setBalance}
                address={address}
                setAddress={setAddress}
            />
            <Transfer setBalance={setBalance} address={address}/>
        </div>
    );
}

export default App;
