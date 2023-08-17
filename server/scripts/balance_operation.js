import { arr } from "../../server/scripts/accounts_array.js";
import Transfer from "../../client/src/Transfer.jsx"
import Wallet from "../../client/src/Wallet.jsx";
 class Operation{
   RecipientChange  (recipient){
      const recipientObj = arr.find(item => item.address === recipient);
      //debugger;
        return recipientObj;
    }

    SenderChange  (senderAddress) {
      const senderObj = arr.find(item => item.address === senderAddress);
      //debugger;
        return senderObj;
    }
      //перевірити відносно валет
      updateBalanceForRecipient(recipient, sendAmount) {
        const updatedArr = arr.map(item => {
          if (item.address === recipient) {
            return { ...item, balance: item.balance + sendAmount };
          }
          return item;
        });
        arr.splice(0, arr.length, ...updatedArr);
        console.log(arr[0], arr[1]);
      }
    
      updateBalanceForSender(senderAddress, sendAmount) {
        const updatedArr = arr.map(item => {
          if (item.address === senderAddress) {
            return { ...item, balance: item.balance - sendAmount };
          }
          return item;
        });
        arr.splice(0, arr.length, ...updatedArr);
        console.log(arr[0], arr[1]);
      }
    }
    
export default Operation;