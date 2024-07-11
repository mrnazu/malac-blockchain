// api/api.js

const express = require('express');
const router = express.Router();
const Blockchain = require('../src/blockchain/blockchain');

const blockchain = new Blockchain();

// Get the entire blockchain
router.get('/blockchain', (req, res) => {
  res.json(blockchain.chain);
});

// Get a specific block by index
router.get('/block/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const block = blockchain.chain.find(b => b.index === index);
  if (block) {
    res.json(block);
  } else {
    res.status(404).send('Block not found');
  }
});

// Create a new transaction
router.post('/transaction', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const blockIndex = blockchain.createNewTransaction(amount, sender, recipient);
  res.json({ message: `Transaction will be added in block ${blockIndex}` });
});

// Mine a new block
router.get('/mine', (req, res) => {
  const lastBlock = blockchain.getLastBlock();
  const previousHash = lastBlock.hash;
  const currentBlockData = { index: lastBlock.index + 1, transactions: blockchain.UTXO };
  const difficulty = 4; // You can adjust the difficulty as needed

  const { nonce, hash } = blockchain.proofOfWork(previousHash, currentBlockData, difficulty);

  const newBlock = blockchain.NewBlock(nonce, previousHash, hash);
  res.json({ message: 'New block mined successfully', block: newBlock });
});

// Get the balance of a specific address
router.get('/balance/:address', (req, res) => {
  const address = req.params.address;
  let balance = 0;

  blockchain.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.recipient === address) {
        balance += transaction.amount;
      } else if (transaction.sender === address) {
        balance -= transaction.amount;
      }
    });
  });

  res.json({ address, balance });
});

// Get the list of pending transactions
router.get('/pending-transactions', (req, res) => {
  res.json(blockchain.UTXO);
});

// Get the current mining difficulty
router.get('/difficulty', (req, res) => {
  res.json({ difficulty: 4 }); // Static difficulty for now
});

module.exports = router;
