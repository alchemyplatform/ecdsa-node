// src/scripts/utils/format.ts
export const FormatUtils = {
  // Simple address shortener
  shortAddress: (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`,
  
  // Basic ETH formatter
  eth: (amount: number) => 
    `${amount} ETH`
};