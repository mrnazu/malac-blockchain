// src/blockchain/blockchain.js

const Block = require("./block");
const Transaction = require("./transaction");
const { proofOfWork, hashBlock } = require("../consensus/pow");

class Blockchain {
  constructor() {
    this.chain = [];
    this.UTXO = [];
    this.createGenesisBlock();
    this.difficulty = 3; // Initial difficulty level
    this.adjustmentInterval = 10; // Interval (in blocks) to adjust difficulty
  }

  // Genesis block or the very first block in the blockchain
  createGenesisBlock() {
    const genesisBlock = new Block(0, Date.now(), [], "0x0", "0x0", "0x0");
    this.chain.push(genesisBlock);
  }

  // Get the last block in the blockchain
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Create a new block in the blockchain
  NewBlock(nonce, prvHash, hash) {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      this.UTXO.slice(), // Include pending transactions
      nonce,
      hash,
      prvHash
    );
    this.UTXO = []; // Clear the UTXO after including transactions in the block
    this.chain.push(newBlock);

    // difficulty every adjustmentInterval blocks
    if (this.chain.length % this.adjustmentInterval === 0) {
      this.adjustDifficulty();
    }

    return newBlock;
  }

  // Create a new tx and add it to the unconfirmed or unspent transactions (UTXO)
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = new Transaction(amount, sender, recipient);
    this.UTXO.push(newTransaction);
    return this.getLastBlock()["index"] + 1;
  }

  // Hashing the block
  hashBlock(prvHash, currentBlock, nonce) {
    return hashBlock(prvHash, currentBlock, nonce);
  }

  // Proof of Work
  proofOfWork(prvHash, currentBlock, difficulty) {
    return proofOfWork(prvHash, currentBlock, difficulty);
  }

  // Adjust difficulty based on network conditions
  adjustDifficulty() {
    const lastBlock = this.getLastBlock();
    const prevAdjustmentBlock = this.chain[this.chain.length - this.adjustmentInterval];
    const timeExpected = this.adjustmentInterval * 1000 * 60; // Expected time in milliseconds for this many blocks (adjustmentInterval blocks)

    const timeTaken = lastBlock.timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
      this.difficulty++;
    } else if (timeTaken > timeExpected * 2) {
      this.difficulty--;
    }

    // difficulty never drops below 1
    if (this.difficulty < 1) {
      this.difficulty = 1;
    }
  }
}

module.exports = Blockchain;