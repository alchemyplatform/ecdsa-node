import { arr } from "../../server/scripts/accounts_array.js";
import Transfer from "../../client/src/Transfer.jsx"
import Wallet from "../../client/src/Wallet.jsx";
 class Operation{
   RecipientChange  (recipient){
      const recipientObj = arr.find(item => item.address === recipient);
        return recipientObj;
    }

    SenderChange  (senderAddress) {
      const senderObj = arr.find(item => item.address === senderAddress); 
        return senderObj;
    }
      //перевірити відносно валет
      updateBalanceForRecipient(recipient, sendAmount) {
        const updatedArr = arr.map(recipient => recipient.balance += sendAmount);
        console.log(recipient.balance);
        return updatedArr;
      }
    
      updateBalanceForSender(senderAddress, sendAmount) {
        const updatedArr = arr.map(senderAddress => senderAddress.balance -= sendAmount);
        console.log(senderAddress.balance);
        return updatedArr;
      }
    }
    
export default Operation;