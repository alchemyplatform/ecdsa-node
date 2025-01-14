// src/core/wallet/types.ts

/**
 * Represents a wallet with encrypted private key storage.
 * Following Ethereum wallet standards with added encryption.
 */
export interface Wallet {
    /** The wallet's Ethereum address (EIP-55 compliant) */
    address: string;
    
    /** The wallet's public key in hex format */
    publicKey: string;
    
    /** The wallet's encrypted private key */
    privateKey: string;
    
    /** Indicates if the private key is encrypted */
    isEncrypted: boolean;
  }
  
  /**
   * Internal wallet representation with decrypted private key.
   * @internal
   * Should only be used within the WalletService for operations requiring the decrypted key.
   */
  export interface DecryptedWallet extends Omit<Wallet, 'privateKey'> {
    /** The wallet's decrypted private key (temporary, for signing only) */
    privateKey: string;
  }
  
  /**
   * Wallet creation options
   */
  export interface WalletOptions {
    /** Skip encryption (not recommended for production) */
    skipEncryption?: boolean;
  }