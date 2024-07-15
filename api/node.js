// api/node.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const blockchainRoutes = require("./api");
const { addPeer, getPeers, removePeer } = require("./peerManager");
const Blockchain = require("../src/blockchain/blockchain");
const fetch = require("node-fetch");
const { loadKeys } = require('../src/blockchain/crypto/keyManager');
const Transaction = require('../src/blockchain/transaction');

const app = express();
const port = process.env.PORT || 3000;
const peers = new Set(getPeers());

const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use("/api", blockchainRoutes);

// Function to register a node with a peer with retry logic
const registerNodeWithRetry = async (peerUrl, selfUrl, retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fetch(`${peerUrl}/add-peer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer: selfUrl }),
      });
      console.log(`Successfully registered with ${peerUrl}`);
      return; // Exit the function if successful
    } catch (error) {
      console.error(`Failed to register with ${peerUrl}: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying registration with ${peerUrl}... Attempt ${attempt}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
      } else {
        console.error(`All registration attempts with ${peerUrl} failed.`);
      }
    }
  }
};

// Register this node with all peers
const registerNode = async () => {
  const selfUrl = `http://localhost:${port}`;
  addPeer(selfUrl);

  const peers = ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005"];

  for (const peer of peers) {
    await registerNodeWithRetry(peer, selfUrl);
  }
};

app.post("/add-peer", (req, res) => {
  const { peer } = req.body;
  if (!peers.has(peer)) {
    peers.add(peer);
    addPeer(peer);
  }
  res.json({ message: `Peer ${peer} added successfully` });
});

app.post("/add-peer", (req, res) => {
  const { peer } = req.body;
  if (!peers.has(peer)) {
    peers.add(peer);
    addPeer(peer);
  }
  res.json({ message: `Peer ${peer} added successfully` });
});

const broadcast = (path, data) => {
  peers.forEach(async (peer) => {
    try {
      await fetch(`${peer}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Failed to broadcast to peer ${peer}`, error);
    }
  });
};

app.post("/api/transaction", (req, res) => {
  const { amount, sender, recipient } = req.body;
  if (amount <= 0 || !sender || !recipient) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  try {
    const { privateKey } = loadKeys();
    console.log('Loaded private key:', privateKey); // Debug log
    const transaction = new Transaction(amount, sender, recipient, privateKey);
    
    const blockIndex = blockchain.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient, transaction.signature, transaction.id);
    broadcast("/api/transaction", transaction);
    res.status(201).json({ message: `Transaction will be added in block ${blockIndex}`, transaction });
  } catch (error) {
    console.error('Error loading keys:', error); // Error log
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/mine", (req, res) => {
  const lastBlock = blockchain.getLastBlock();
  const previousHash = lastBlock.hash;
  const currentBlockData = {
    index: lastBlock.index + 1,
    transactions: blockchain.UTXO,
  };
  const difficulty = 4;

  const { nonce, hash } = blockchain.proofOfWork(
    previousHash,
    currentBlockData,
    difficulty
  );
  const newBlock = blockchain.NewBlock(nonce, previousHash, hash);

  broadcast("/api/blockchain", { chain: blockchain.chain });
  res.status(201).json({ message: "New block mined successfully", block: newBlock });
});

app.use(bodyParser.json());
app.post("/sync", (req, res) => {
  try {
    const { chain } = req.body;
    if (!Array.isArray(chain)) {
      throw new Error("Invalid data format: chain should be an array");
    }
    console.log("Received blockchain data:", chain);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error processing /sync request:", error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get("/status", (req, res) => {
  const status = {
    port: port,
    peers: Array.from(peers),
  };
  res.json(status);
});

app.get("/peers", (req, res) => {
  res.json(Array.from(peers));
});

app.delete("/remove-peer", (req, res) => {
  const { peer } = req.body;
  if (peers.has(peer)) {
    peers.delete(peer);
    removePeer(peer);
    res.json({ message: `Peer ${peer} removed successfully` });
  } else {
    res.status(404).json({ error: `Peer ${peer} not found` });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Node listening on port ${port}`);
  registerNode();
});