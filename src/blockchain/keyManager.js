// src/blockchain/keyManager.js

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Directory to store keys
const KEYS_DIR = path.join(__dirname, '../../data/keys');

// Generate a key pair
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

  // Save keys to files
  fs.writeFileSync(path.join(KEYS_DIR, 'user_private.pem'), privateKey);
  fs.writeFileSync(path.join(KEYS_DIR, 'user_public.pem'), publicKey);

  return { publicKey, privateKey };
};

// Load keys from files
const loadKeys = () => {
  const privateKey = fs.readFileSync(path.join(KEYS_DIR, 'user_private.pem'), 'utf8');
  const publicKey = fs.readFileSync(path.join(KEYS_DIR, 'user_public.pem'), 'utf8');
  return { privateKey, publicKey };
};

module.exports = { generateKeyPair, loadKeys };