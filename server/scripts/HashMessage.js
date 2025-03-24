import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { toHex } from "ethereum-cryptography/utils.js";

export function HashMessage(recipientAddress, senderAddress, Amount) {
  const recipient = recipientAddress;
  const address = senderAddress;
  const amount = Amount;
  // Convert your input strings to Uint8Arrays before concatenating
  const recipientBytes = utf8ToBytes(recipient);
  const addressBytes = utf8ToBytes(address);
  const amountBytes = utf8ToBytes(amount);
  
  // Concatenate the bytes of recipient, address, and amount
  const combinedDataUTF8 = new Uint8Array([
    ...recipientBytes,
    ...addressBytes,
    ...amountBytes
  ]);

  // Hash the combined data using keccak256
  const hash = toHex(combinedDataUTF8);
  return hash;
}
