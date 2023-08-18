import React from "react";
import { LogInComponent } from "./LogInPage"; // Передбачаючи, що це правильний шлях до компонента LogInPage
import { arr } from "../../server/scripts/accounts_array.js";
import Transfer  from "./Transfer";


class Wallet extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      balance: 0,
      privatKey: "",
      publicKey: "",
      senderAddress:""
    };

  }

  handleLogin = (address, balance,privatKey,publicKey,senderAddress) => {
    // Отримання даних з компонента LogInPage та оновлення стану Wallet
    this.setState({
      address: address,
      balance: balance,
      privatKey: privatKey,
      publicKey: publicKey,
      senderAddress:address
    });
    //this.props.onLogin(address,balance);
  }
  handleAddressChange = (evt) => {
    const newAddress = evt.target.value;
    this.setState({
      
      address: newAddress
    });
    this.props.onAddressChange(newAddress); 
    console.log(`Address changed to: ${newAddress}`);
  }

  handleCheckBalance = () => {
    const foundUser = this.findUserByAddress(this.state.address);
    if (foundUser) {
      this.setState({ balance: foundUser.balance });
    } else {
      // Якщо адрес не знайдено, можна встановити баланс в 0 або вивести повідомлення
      this.setState({ balance: 0 });
       alert("Адрес не знайдено");
    }
  }

  findUserByAddress = (address) => {
    // Пошук користувача за адресою у масиві arr
    return arr.find((user) => user.address === address);
  }
  render() {
    return (
      <div className="container wallet">
        <h1>Your Wallet</h1>
        <LogInComponent onLogin={this.handleLogin} />
        <input
            type="text"
           // value={this.state.address}
            onChange={this.handleAddressChange}

          />
        <div className="balance">Balance: {this.state.balance}</div>
         <button onClick={this.handleCheckBalance}>Check Balance</button>
         {/* <Transfer senderAddress={this.state.address} /> */}
        <h3>Your Data</h3>
        <p>Keep your privat key in secret !</p>
        <div className="usersData">
       <p> Address: {this.state.address}</p>
       <p>Balance:  {this.state.balance}  </p> 
       <p> Public Key:  {this.state.publicKey}</p>
       <p> Privat Key:  {this.state.privatKey}</p>
        </div>
      </div>
    );
  }
}

export default Wallet;
