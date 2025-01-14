import express from 'express';
import { WalletService } from '../core/wallet';
import { ValidationError } from '../core/errors';
import logger from '../utils/logger';

const router = express.Router();

// Create a new wallet
router.post('/wallet', async (req, res, next) => {
  try {
    const walletService = new WalletService();
    const wallet = await walletService.createWallet();
    // Never send private key in production!
    // Only for demonstration purposes
    res.status(201).json({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  } catch (error) {
    next(error);
  }
});

// Get wallet balance
router.get('/balance/:address', (req, res, next) => {
  try {
    const { address } = req.params;
    const balance = WalletService.getBalance(address);
    res.json({ balance });
  } catch (error) {
    next(error);
  }
});

// Send amount
router.post('/send', (req, res, next) => {
  try {
    const { sender, recipient, amount, signature } = req.body;

    if (!sender || !recipient || !amount || !signature) {
      throw new ValidationError('Missing required fields');
    }

    const success = WalletService.sendAmount(
      sender,
      recipient,
      String(amount),
      signature
    );

    res.json({ success });
  } catch (error) {
    next(error);
  }
});

export default router;