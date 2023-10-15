import { arr } from "../../server/scripts/accounts_array.js";

 class Operation{
   RecipientChange  (recipient){
      const recipientObj = arr.find(item => item.address === recipient);
        return recipientObj;
    }

    SenderChange  (senderAddress) {
      const senderObj = arr.find(item => item.address === senderAddress); 
        return senderObj;
    }

      updateBalanceForRecipient(recipient, sendAmount) {
      arr.forEach(item => {
        if (item.address === recipient.address) {
          item.balance += parseInt(sendAmount);
        }
      });
      return arr;
    }
    
    updateBalanceForSender(senderAddress, sendAmount) {
      arr.forEach(item => {
        if (item.address === senderAddress.address) {
          item.balance -= parseInt(sendAmount);
        }
      });
      return arr;
    }
       
 }

export default Operation;