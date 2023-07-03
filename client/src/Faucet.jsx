import { useState } from "react";
import server from "./server";

export default function Faucet({faucetBalance, setFaucetBalance, address}){
    const [receiveAmount, setReceiveAmount] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function receiveEth(evt){
        evt.preventDefault();
        
        const requestedAmount = parseInt(receiveAmount);
        setReceiveAmount(requestedAmount);

        if(requestedAmount > 0){
            try{
                const {
                    data: { newFaucetBalance },
                } = await server.post(`/receiveFromFaucet`, {
                    amount: requestedAmount,
                    recipient: address,
                });

                console.log("newFaucetBalance:", newFaucetBalance);

                setFaucetBalance(newFaucetBalance);
            } catch (ex) {
                alert(ex.response.data.message);
            }
        }
        else{
            alert("Please enter a valid amount");
        }
    }

    return (
        <div className="container faucet">
            <h1>Server Faucet</h1>

            <div className="faucetBalance">Balance: {faucetBalance}</div>

            <form className="reveiveEth" onSubmit={receiveEth}>
                <h3>Get some ETH</h3>
                <label>
                    for your address: 0x{address.slice(0,4)}...{address.slice(-4)}
                </label>

                <label>
                    Amount
                    <input 
                        placeholder="1 Ξ"
                        value={receiveAmount}
                        onChange={setValue(setReceiveAmount)}
                    />
                </label>
                <input type="submit" className="button" value="Receive ETH" />
            </form>

            {/* <label>
                <input placeholder="Type in an address" value={address}></input>
                <input placeholder="Type in an amount" value={amount}></input>
            </label> */}

            
        </div>
    );
}

//export default Faucet;
