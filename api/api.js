// api/api.js

const express = require('express');
const router = express.Router();
const Blockchain = require('../src/blockchain/blockchain');
const { validateTransaction } = require('./middleware/validationMiddleware');

const blockchain = new Blockchain();

router.get('/blockchain', (req, res) => {
  res.json(blockchain.chain);
});

router.get('/block/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const block = blockchain.chain.find(b => b.index === index);
  if (block) {
    res.json(block);
  } else {
    res.status(404).json({ error: 'Block not found' });
  }
});

router.post('/transaction', validateTransaction, (req, res) => {
  const { amount, sender, recipient } = req.body;
  if (amount <= 0 || !sender || !recipient) {
    return res.status(400).json({ error: 'Invalid transaction data' });
  }

  const { privateKey } = loadKeys();
  const transaction = new Transaction(amount, sender, recipient, privateKey);
  const blockIndex = blockchain.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient, transaction.signature, transaction.id);
  res.status(201).json({ message: `Transaction will be added in block ${blockIndex}`, transaction });
});

router.get('/mine', (req, res) => {
  const lastBlock = blockchain.getLastBlock();
  const previousHash = lastBlock.hash;
  const currentBlockData = { index: lastBlock.index + 1, transactions: blockchain.UTXO };
  const difficulty = 4;

  const { nonce, hash } = blockchain.proofOfWork(previousHash, currentBlockData, difficulty);

  const newBlock = blockchain.NewBlock(nonce, previousHash, hash);
  res.status(201).json({ message: 'New block mined successfully', block: newBlock });
});

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

router.get('/pending-transactions', (req, res) => {
  res.json(blockchain.UTXO);
});

router.get('/difficulty', (req, res) => {
  res.json({ difficulty: 4 });
});

module.exports = router;