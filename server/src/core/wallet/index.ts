// src/core/wallet/index.ts
import { CryptoService } from '../crypto';
import { EncryptionService } from '../encryption';
import { WalletError, EncryptionError } from '../errors';
import logger from '../../utils/logger';
import { Wallet, DecryptedWallet } from './types';
import { parseUnits, getAddress } from 'ethers';

/**
 * Service for managing Ethereum-compatible wallets with encrypted storage.
 */
export class WalletService {
  private balances: Record<string, number> = {};

  /**
   * Creates a new wallet with encrypted private key storage.
   * @returns A new wallet instance with encrypted private key
   * @throws {WalletError} If wallet creation fails
   * @throws {EncryptionError} If key encryption fails
   */
  async createWallet(): Promise<Wallet> {
    try {
      // Generate new key pair
      const { privateKey, publicKey, address } = CryptoService.generateKeyPair();
      
      // Always encrypt the private key
      const encryptedPrivateKey = await EncryptionService.encryptPrivateKey(privateKey);

      // Create wallet with encrypted key
      const wallet: Wallet = {
        address,
        publicKey,
        privateKey: encryptedPrivateKey,
        isEncrypted: true  // Always true since we always encrypt
      };

      return wallet;
    } catch (error) {
      logger.error('Failed to create wallet:', error);
      throw new WalletError('Failed to create wallet');
    }
  }

  /**
   * Gets a decrypted wallet instance for signing operations.
   * @internal
   * @param wallet - The encrypted wallet
   * @returns Wallet with decrypted private key
   * @throws {EncryptionError} If decryption fails
   */
  private async getDecryptedWallet(wallet: Wallet): Promise<DecryptedWallet> {
    try {
      const decryptedKey = await EncryptionService.decryptPrivateKey(wallet.privateKey);
      
      return {
        ...wallet,
        privateKey: decryptedKey,
      };
    } catch (error) {
      logger.error('Failed to decrypt wallet:', error);
      throw new EncryptionError('Failed to decrypt wallet for signing');
    }
  }

  /**
   * Gets the balance of a wallet address
   * @param address - The wallet address to check
   * @returns The balance of the wallet
   */
  getBalance(address: string): number {
    const normalizedAddress = getAddress(address);
    return this.balances[normalizedAddress] || 0;
  }

  /**
   * Sets the balance of a wallet (for testing purposes)
   * @param address - The wallet address
   * @param amount - The amount to set
   */
  setBalance(address: string, amount: number): void {
    const normalizedAddress = getAddress(address);
    this.balances[normalizedAddress] = amount;
  }

  /**
   * Sends an amount from one address to another
   * @param sender - The sender's address
   * @param recipient - The recipient's address
   * @param amount - The amount to send
   * @param signature - The transaction signature
   * @returns Success status of the transaction
   */
  async sendAmount(
    sender: string,
    recipient: string,
    amount: string,
    signature: string
  ): Promise<boolean> {
    try {
      const normalizedSender = getAddress(sender);
      const normalizedRecipient = getAddress(recipient);
      const amountValue = Number(amount);

      if (this.balances[normalizedSender] < amountValue) {
        throw new WalletError('Insufficient funds');
      }

      const message = `\x19Ethereum Signed Message:\n${normalizedSender.length}${normalizedSender}${normalizedRecipient}${amount}`;
      const recoveredAddress = CryptoService.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== normalizedSender.toLowerCase()) {
        throw new WalletError('Invalid signature');
      }

      this.balances[normalizedSender] -= amountValue;
      this.balances[normalizedRecipient] = (this.balances[normalizedRecipient] || 0) + amountValue;

      return true;
    } catch (error) {
      logger.error('Failed to send amount:', error);
      throw new WalletError('Failed to send amount');
    }
  }
}