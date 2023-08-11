import App from "./App";
import { useState } from "react";
import {AddressConfig} from "../../server/scripts/logs.js"



function LogIn(){

    const [address, setAddress] = useState("");
    const [showResult, setShowResult] = useState(false);

    const getAddress = async( )=>{
        try{
            const generatedAddress = AddressConfig.addressGen();
            setAddress(generatedAddress);
            setShowResult(true);

        }
        catch(error){
            console.error("Error generating address:",error);
        }
    };
    return (

        <form className="container login" onSubmit={event => event.preventDefault()}>
          <h1>Log In</h1>
    
          <input type="button" className="button" value="Get the account address" onClick = {getAddress} />
          <div className="addressOutput">Address: {address}</div> 
          {showResult ? <App address={address} /> : null}
        </form>
      );
      

    }

export default LogIn;