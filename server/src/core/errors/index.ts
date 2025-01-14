export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletError';
  }
}

export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class InvalidKeyError extends EncryptionError {
  constructor(message = 'Invalid private key format') {
    super(message);
    this.name = 'InvalidKeyError';
  }
}

export class EncryptionKeyError extends EncryptionError {
  constructor(message = 'Invalid encryption key configuration') {
    super(message);
    this.name = 'EncryptionKeyError';
  }
}