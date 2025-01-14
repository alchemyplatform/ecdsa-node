// src/core/encryption/index.ts
import CryptoJS from 'crypto-js';
import { config } from '../../config/config';
import { EncryptionError, InvalidKeyError, EncryptionKeyError } from '../errors';
import { isHexString } from 'ethers'; // Using ethers validation

export class EncryptionService {
  private static readonly keyLength = 32; // 256 bits

  static encryptPrivateKey(privateKey: string): string {
    try {
      // Validate private key format (following ethers.js pattern)
      if (!isHexString(privateKey, 32)) {
        throw new InvalidKeyError('Private key must be a 32-byte hex string');
      }

      if (!this.validateEncryptionKey()) {
        throw new EncryptionKeyError();
      }

      return CryptoJS.AES.encrypt(privateKey, config.encryptionKey).toString();
    } catch (error) {
      if (error instanceof EncryptionError) {
        throw error;
      }
      throw new EncryptionError('Failed to encrypt private key');
    }
  }

  static decryptPrivateKey(encryptedKey: string): string {
    try {
      if (!this.validateEncryptionKey()) {
        throw new EncryptionKeyError();
      }

      const bytes = CryptoJS.AES.decrypt(encryptedKey, config.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // Validate decrypted key format
      if (!isHexString(decrypted, 32)) {
        throw new InvalidKeyError('Decrypted key is invalid');
      }

      return decrypted;
    } catch (error) {
      if (error instanceof EncryptionError) {
        throw error;
      }
      throw new EncryptionError('Failed to decrypt private key');
    }
  }

  static validateEncryptionKey(): boolean {
    return Boolean(config.encryptionKey && config.encryptionKey.length >= this.keyLength);
  }
}