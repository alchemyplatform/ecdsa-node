import React, { useState } from "react";
import { UsersData } from "../../server/scripts/accounts_array.js";

export const LogInComponent = ({ onLogin }) => {
  const [address, setAddress] = useState("");

  const handleLogin = async () => {
    try {
      const userData = UsersData();
      const generatedAddress = userData.address;
      setAddress(generatedAddress);
      onLogin(generatedAddress, userData.balance,userData.privatKey,userData.publicKey);
    } catch (error) {
      console.error("Error generating address:", error);
    }
  };

  return (
    <form className="container login" onSubmit={(event) => event.preventDefault()}>
      <input type="button" className="button" value="Get the account address" onClick={handleLogin} />
    </form>
  );
};
