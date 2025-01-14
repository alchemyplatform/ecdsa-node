import dotenv from 'dotenv';
import { z } from 'zod'; // We'll need to install this

dotenv.config();

// Runtime validation schema
const configSchema = z.object({
  port: z.string().default('3042'),
  nodeEnv: z.enum(['development', 'production']).default('development'),
  chainId: z.number().default(1337), // Local testnet
  blockTime: z.number().default(12000), // 12 seconds like Ethereum
  maxGasLimit: z.number().default(30000000),
  encryptionKey: z.string().min(32, 'Encryption key must be at least 32 characters')
});

// Type inference
type Config = z.infer<typeof configSchema>;

// Validate environment variables at runtime
export const config: Config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : undefined,
  blockTime: process.env.BLOCK_TIME ? parseInt(process.env.BLOCK_TIME) : undefined,
  maxGasLimit: process.env.MAX_GAS_LIMIT ? parseInt(process.env.MAX_GAS_LIMIT) : undefined,
  encryptionKey: process.env.ENCRYPTION_KEY
});

// Freeze config object to prevent runtime modifications
Object.freeze(config);