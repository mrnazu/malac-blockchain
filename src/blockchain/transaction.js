// src/blockchain/transaction.js

const crypto = require('crypto');

// Constructor for transaction properties
class Transaction {
  constructor(amount, sender, recipient, privateKey) {
    this.id = crypto.randomUUID(); // Unique transaction ID
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.timestamp = new Date().toISOString(); // Timestamp of transaction creation
    this.signature = this.signTransaction(privateKey); // Digital signature
  }

  // Sign the transaction using the sender's private key
  signTransaction(privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(`${this.amount}${this.sender}${this.recipient}${this.timestamp}`);
    return sign.sign({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString('hex');
  }

  // Verify the transaction signature using the sender's public key
  verifyTransactionSignature(publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(`${this.amount}${this.sender}${this.recipient}${this.timestamp}`);
    return verify.verify(publicKey, this.signature, 'hex');
  }
}

module.exports = Transaction;