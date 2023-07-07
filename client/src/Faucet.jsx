import { useState } from "react";
import { ethers } from 'ethers';

import server from "./server";

function Faucet({faucetBalance, setFaucetBalance, address}){
    const [receiveAmount, setReceiveAmount] = useState("");

    //const setValue = (setter) => (evt) => setter(evt.target.value);

    async function receiveEth(evt){
        evt.preventDefault();

        if(ethers.isAddress(address)){
            if(Number.isInteger(receiveAmount) && receiveAmount > 0){
                try{
                    const {
                        data: { newFaucetBalance },
                    } = await server.post(`/receiveFromFaucet`, {
                        amount: receiveAmount,
                        recipient: address,
                    });

                    console.log("newFaucetBalance:", newFaucetBalance);

                    setFaucetBalance(newFaucetBalance);
                } catch (ex) {
                    console.log(ex);
                    alert(ex.response.data.message);
                }
            }
            else{
                alert("Please enter a valid amount");
            }
        } else {    
            alert("Please enter a valid address");
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
                        onChange={event => setReceiveAmount(
                            parseInt(event.target.value) || 0
                        )}
                    />
                </label>
                <input type="submit" className="button" value="Receive ETH" />
            </form>          
        </div>
    );
}

export default Faucet;