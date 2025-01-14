// src/scripts/utils/wallet.ts
import { FormatUtils } from './format';

export const WalletUtils = {
  // Print wallet details
  printDetails: (label: string, address: string, balance?: number) => {
    console.log(`${label}:`);
    console.log(`  Address: ${FormatUtils.shortAddress(address)}`);
    if (balance !== undefined) {
      console.log(`  Balance: ${FormatUtils.eth(balance)}`);
    }
  }
};