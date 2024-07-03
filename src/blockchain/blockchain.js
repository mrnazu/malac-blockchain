// src/blockchain/blockchain.js

const Block = require("./block");
const Transaction = require("./transaction");

class Blockchain {
  constructor() {
    this.chain = [];
    this.UTXO = [];
    this.createGenesisBlock();
  }

  // genesis block or the very first block in the blockchain
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

  // Create a new transaction and add it to the unconfirmed or unspent, (i guess) transactions (UTXO)
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = new Transaction(amount, sender, recipient);
    this.UTXO.push(newTransaction);
    return this.getLastBlock()["index"] + 1;
  }
}

module.exports = Blockchain;