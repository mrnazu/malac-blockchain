// src/blockchain/blockchain.js

function Blockchain() {
  this.chain = [];
  this.currentTransactions = [];
}

Blockchain.prototype.NewBlock = function(nonce, prvHash, hash) {
    const Block = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        tx: this.newTX,
        nonce: nonce,
        hash: hash,
        prvHash: prvHash
    };

    this.newTX = [];
    this.chain.push(Block);
    return Block;
}

module.exports = Blockchain;