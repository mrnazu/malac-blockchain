// src/blockchain/transaction.js

const crypto = require('crypto');

class Transaction {
  constructor(amount, sender, recipient, privateKey) {
    this.id = crypto.randomUUID(); // Unique transaction ID
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.timestamp = new Date().toISOString(); // Timestamp of transaction creation
    this.signature = this.signTransaction(privateKey); // Digital signature
  }

  signTransaction(privateKey) {
    try {
      const sign = crypto.createSign('SHA256');
      sign.update(`${this.amount}${this.sender}${this.recipient}${this.timestamp}`);
      return sign.sign({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }).toString('hex');
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  verifyTransactionSignature(publicKey) {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(`${this.amount}${this.sender}${this.recipient}${this.timestamp}`);
      return verify.verify(publicKey, this.signature, 'hex');
    } catch (error) {
      console.error('Error verifying transaction signature:', error);
      throw error;
    }
  }
}

module.exports = Transaction;