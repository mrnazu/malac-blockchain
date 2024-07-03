// src/blockchain/block.js

// Constructor for block properties
class Block {
  constructor(index, timestamp, transactions, nonce, hash, prvHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = nonce;
    this.hash = hash;
    this.prvHash = prvHash;
  }
}

module.exports = Block;
