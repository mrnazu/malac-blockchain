// src/blockchain/blockchain.js

const Block = require("./block");
const Transaction = require("./transaction");
const { proofOfWork, hashBlock } = require("../consensus/pow");

class Blockchain {
  constructor() {
    this.chain = [];
    this.UTXO = [];
    this.createGenesisBlock();
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

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check hash consistency
      if (currentBlock.prvHash !== previousBlock.hash) {
        return false;
      }

      // Check block hash
      const blockData = {
        index: currentBlock.index,
        transactions: currentBlock.transactions,
        nonce: currentBlock.nonce,
      };
      const calculatedHash = this.hashBlock(
        previousBlock.hash,
        blockData,
        currentBlock.nonce
      );
      if (currentBlock.hash !== calculatedHash) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Blockchain;