// src/blockchain/transaction.js

// const { signData, verifySignature } = require('./crypto/signatureManager');
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// const TRANSACTIONS_DIR = path.join(__dirname, '../../data/transactions');

// // Ensure the transactions directory exists
// if (!fs.existsSync(TRANSACTIONS_DIR)) {
//   fs.mkdirSync(TRANSACTIONS_DIR, { recursive: true });
// }

// Example of a transaction object
class Transaction {
  constructor(amount, sender, recipient, signature) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.signature = signature;
    this.id = null;
  }

  signTransaction(privateKey) {
    if (typeof privateKey !== 'string') {
        throw new TypeError('Private key must be a string');
    }

    // Sign the transaction using the private key
    try {
        const sign = crypto.createSign('SHA256');
        sign.update(`${this.amount}${this.sender}${this.recipient}`);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');
        this.signature = signature;
    } catch (error) {
        throw new Error('Failed to sign transaction: ' + error.message);
    }
}
}

const saveTransaction = (transaction) => {
  const filePath = path.join(
    __dirname,
    "../../data/transactions",
    `${transaction.sender}_${Date.now()}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(transaction, null, 2));
};

module.exports = { Transaction, saveTransaction };