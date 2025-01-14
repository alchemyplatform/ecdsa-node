export interface Transfer {
    sender: string;
    recipient: string;
    amount: number;
    signature?: string;
  }
  
  export interface WalletInfo {
    address: string;
    balance: number;
  }