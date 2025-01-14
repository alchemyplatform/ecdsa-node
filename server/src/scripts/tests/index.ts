// src/scripts/tests/index.ts
import { ConsoleUtils as console } from '../utils/console';
import { walletTest } from './wallet.test';

async function runTests() {
  try {
    process.stdout.write('\x1Bc'); // Clear console
    console.printSection('Running ECDSA Tests');
    
    // Run wallet tests
    await walletTest();
    
    console.printSection('All Tests Complete ✅');
  } catch (error: any) {
    console.printSection('Test Suite Failed ❌');
    console.log(error.message || String(error));
    process.exit(1);
  }
}

runTests();