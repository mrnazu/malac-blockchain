// src/blockchain/signatureManager.js

const crypto = require('crypto');
const path = require('path');
const { loadKeys } = require('./keyManager');

const signData = (data) => {
  try {
    const { privateKey } = loadKeys();
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'hex'); // or 'base64'
    return signature;
  } catch (error) {
    console.error('Error signing data:', error);
    throw error;
  }
};

const verifySignature = (data, signature) => {
  try {
    const { publicKey } = loadKeys();
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();
    const isValid = verify.verify(publicKey, signature, 'hex'); // or 'base64'
    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};

module.exports = { signData, verifySignature };