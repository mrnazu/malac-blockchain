// api/api.js

const express = require('express');
const router = express.Router();
const Blockchain = require('../src/blockchain/blockchain');
const { Transaction, saveTransaction } = require('../src/blockchain/transaction');
const { validateTransaction } = require('./middleware/validationMiddleware');
const { loadKeys } = require('../src/blockchain/crypto/keyManager');

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
  console.log('Received transaction request:', req.body);

  // Validate the input
  if (typeof amount !== 'number' || typeof sender !== 'string' || typeof recipient !== 'string' || typeof privateKey !== 'string') {
    return res.status(400).json({ error: 'Invalid input data' })
  }

  if (amount <= 0 || !sender || !recipient) {
    return res.status(400).json({ error: 'Invalid transaction data' });
  }

  try {
    const { privateKey } = loadKeys();
    if (!privateKey) {
      throw new Error('Failed to load private key');
    }
    
    const transaction = new Transaction(amount, sender, recipient, privateKey);
    console.log('Created transaction:', transaction);

    transaction.signTransaction();
    console.log('Signed transaction:', transaction);

    saveTransaction(transaction);
    console.log('Transaction saved');

    const blockIndex = blockchain.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient, transaction.signature, transaction.id);
    console.log('Transaction added to blockchain, block index:', blockIndex);

    res.status(201).json({ message: `Transaction will be added in block ${blockIndex}`, transaction });
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
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