import { EncryptionService } from '../../core/encryption';
import { EncryptionError, InvalidKeyError, EncryptionKeyError } from '../../core/errors';
import { Wallet } from 'ethers';

async function testEncryption() {
  try {
    console.log('🔒 Testing Encryption Service...\n');

    // Generate a test wallet
    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    console.log('Generated test wallet private key:', privateKey);

    // Test encryption
    console.log('\n1. Testing encryption...');
    const encrypted = EncryptionService.encryptPrivateKey(privateKey);
    console.log('Encrypted:', encrypted);

    // Test decryption
    console.log('\n2. Testing decryption...');
    const decrypted = EncryptionService.decryptPrivateKey(encrypted);
    console.log('Decrypted:', decrypted);

    // Verify
    console.log('\n3. Verifying results...');
    if (privateKey === decrypted) {
      console.log('✅ Success: Encryption/Decryption working correctly!');
    } else {
      console.log('❌ Error: Decrypted key does not match original!');
    }

  } catch (error: unknown) {
    if (error instanceof EncryptionError) {
      console.error('❌ Encryption Error:', error.message);
    } else if (error instanceof Error) {
      console.error('❌ Unexpected Error:', error.message);
    } else {
      console.error('❌ Unknown Error:', error);
    }
  }
}

testEncryption();