// src/blockchain/blockchain.js

const Block = require("./block");
const Transaction = require("./transaction");
const { proofOfWork, hashBlock } = require("../consensus/pow");
const { loadKeys } = require('./keyManager');

class Blockchain {
  constructor() {
    this.chain = [];
    this.UTXO = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = new Block(0, Date.now(), [], "0x0", "0x0", "0x0");
    this.chain.push(genesisBlock);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  NewBlock(nonce, prvHash, hash) {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      this.UTXO.slice(),
      nonce,
      hash,
      prvHash
    );
    this.UTXO = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  createNewTransaction(amount, sender, recipient, signature, transactionId) {
    const newTransaction = new Transaction(amount, sender, recipient, signature); // Pass signature here
    newTransaction.id = transactionId;
    this.UTXO.push(newTransaction);
    return this.getLastBlock().index + 1;
  }

  isValidTransaction(transaction) {
    try {
      const { publicKey } = loadKeys();
      return transaction.verifyTransactionSignature(publicKey);
    } catch (error) {
      console.error('Error validating transaction:', error);
      return false;
    }
  }

  hashBlock(prvHash, currentBlock, nonce) {
    return hashBlock(prvHash, currentBlock, nonce);
  }

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

      // Validate all transactions in the block
      for (const transaction of currentBlock.transactions) {
        if (!this.isValidTransaction(transaction)) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Blockchain;