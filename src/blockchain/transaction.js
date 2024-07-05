// src/blockchain/transaction.js

// Constructor for transaction properties
class Transaction {
  constructor(amount, sender, recipient) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
  }
}

module.exports = Transaction;