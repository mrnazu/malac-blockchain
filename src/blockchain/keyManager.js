// src/blockchain/keyManager.js

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEYS_DIR = path.join(__dirname, '../../data/keys');

// Ensure the keys directory exists
if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

// Generate keys if they do not exist
if (!fs.existsSync(path.join(KEYS_DIR, 'user_private.pem')) || !fs.existsSync(path.join(KEYS_DIR, 'user_public.pem'))) {
  generateKeyPair();
  console.log('Keys generated successfully');
}

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  fs.writeFileSync(path.join(KEYS_DIR, 'user_private.pem'), privateKey);
  fs.writeFileSync(path.join(KEYS_DIR, 'user_public.pem'), publicKey);

  return { publicKey, privateKey };
};

const loadKeys = () => {
  const privateKey = fs.readFileSync(path.join(KEYS_DIR, 'user_private.pem'), 'utf8');
  const publicKey = fs.readFileSync(path.join(KEYS_DIR, 'user_public.pem'), 'utf8');
  return { privateKey, publicKey };
};

module.exports = { generateKeyPair, loadKeys };