// src/scripts/tests/wallet-edge-cases.test.ts
import { WalletService } from '../../core/wallet';
import { ConsoleUtils as console } from '../utils/console';
import { WalletError } from '../../core/errors';

async function testEdgeCases() {
  try {
    console.printSection('ECDSA Wallet Edge Cases Test');
    const walletService = new WalletService();

    // Test 1: Insufficient Balance
    await console.loading('Testing insufficient balance');
    const wallet1 = await walletService.createWallet();
    const wallet2 = await walletService.createWallet();
    walletService.setBalance(wallet1.address, 10);

    try {
      await walletService.sendAmount(wallet1.address, wallet2.address, "20", "dummy-signature");
      console.log('❌ Should have failed with insufficient funds');
      process.exit(1);
    } catch (error) {
      if (error instanceof WalletError && error.message.includes('Insufficient funds')) {
        console.log('✅ Correctly failed on insufficient funds');
      } else {
        throw error;
      }
    }

    // Test 2: Invalid Signature
    await console.loading('Testing invalid signature');
    try {
      await walletService.sendAmount(wallet1.address, wallet2.address, "5", "invalid-signature");
      console.log('❌ Should have failed with invalid signature');
      process.exit(1);
    } catch (error) {
      if (error instanceof WalletError && error.message.includes('Invalid signature')) {
        console.log('✅ Correctly failed on invalid signature');
      } else {
        throw error;
      }
    }

    console.log('✅ All edge cases passed!');
  } catch (error) {
    console.log('❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testEdgeCases();