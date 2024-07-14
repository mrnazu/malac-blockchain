// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const blockchainRoutes = require('../api/api');
const app = express();
const port = 3000;

// Function to fetch data with retry logic
const fetchDataWithRetry = async (url, retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data from ${url}: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying... Attempt ${attempt}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
      } else {
        throw new Error(`All attempts to fetch data from ${url} failed.`);
      }
    }
  }
}

app.use(bodyParser.json());
app.use('/api', blockchainRoutes);

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('message', message => {
        console.log('Received message:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Attach WebSocket server to HTTP server
app.server = app.listen(port, () => {
    console.log(`Blockchain API and block explorer running on port ${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
    });
});

// Route to get latest blocks
app.get('/', async (req, res) => {
    try {
        const latestBlocks = await fetchDataWithRetry(`http://localhost:${port}/api/blockchain`);
        res.render('index', { latestBlocks });
    } catch (error) {
        console.error('Error fetching latest blocks:', error);
        res.render('index', { latestBlocks: [] });
    }
});

// Route to get a specific block
app.get('/block/:index', async (req, res) => {
    try {
        const { data: block } = await fetchDataWithRetry(`http://localhost:${port}/api/block/${req.params.index}`);
        res.render('block', { block });
    } catch (error) {
        console.error('Error fetching block:', error);
        res.status(404).send('Block not found');
    }
});

// Broadcast updates to WebSocket clients
function broadcastUpdate(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

app.post('/api/transaction', (req, res) => {
    const { amount, sender, recipient } = req.body;
    if (amount <= 0 || !sender || !recipient) {
        return res.status(400).json({ error: "Invalid transaction data" });
    }

    const { privateKey } = loadKeys();
    const transaction = new Transaction(amount, sender, recipient, privateKey);
    const blockIndex = blockchain.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient, transaction.signature, transaction.id);
    
    // Broadcast the new transaction
    broadcastUpdate({ type: 'transaction', data: transaction });

    res.status(201).json({ message: `Transaction will be added in block ${blockIndex}`, transaction });
});

app.get('/api/mine', (req, res) => {
    const lastBlock = blockchain.getLastBlock();
    const previousHash = lastBlock.hash;
    const currentBlockData = {
        index: lastBlock.index + 1,
        transactions: blockchain.UTXO,
    };
    const difficulty = 4;

    const { nonce, hash } = blockchain.proofOfWork(previousHash, currentBlockData, difficulty);
    const newBlock = blockchain.NewBlock(nonce, previousHash, hash);
    
    // Broadcast the new block
    broadcastUpdate({ type: 'block', data: newBlock });

    res.status(201).json({ message: 'New block mined successfully', block: newBlock });
});

module.exports = app;