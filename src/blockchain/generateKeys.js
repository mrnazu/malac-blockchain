// src/blockchain/generateKeys.js

const { generateKeyPair } = require('./crypto/keyManager');

generateKeyPair();
console.log('Keys generated successfully');