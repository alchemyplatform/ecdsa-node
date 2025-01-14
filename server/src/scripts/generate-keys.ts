import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function generateEncryptionKey(): string {
  // Generate a secure random 32-byte (256-bit) key
  return crypto.randomBytes(32).toString('hex');
}

function updateEnvFile(key: string) {
  const envPath = path.join(__dirname, '../../.env');
  const envExample = path.join(__dirname, '../../.env.example');
  
  // Read existing .env or create new
  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    envContent = fs.readFileSync(envExample, 'utf8');
  }

  // Update or add ENCRYPTION_KEY
  const updated = envContent.includes('ENCRYPTION_KEY=') 
    ? envContent.replace(/ENCRYPTION_KEY=.*/, `ENCRYPTION_KEY=${key}`)
    : `${envContent}\nENCRYPTION_KEY=${key}`;

  fs.writeFileSync(envPath, updated);
  console.log('✅ Encryption key generated and saved to .env');
  
  // Save backup
  const backupPath = path.join(__dirname, '../../.key-backup');
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath);
  }
  fs.writeFileSync(
    path.join(backupPath, `key-${Date.now()}.txt`),
    `ENCRYPTION_KEY=${key}\n`
  );
  console.log('✅ Backup saved in .key-backup (keep this secure!)');
}

// Run
const key = generateEncryptionKey();
updateEnvFile(key);
