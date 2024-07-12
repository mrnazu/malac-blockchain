// api/node.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const blockchainRoutes = require("./api");
const { addPeer, getPeers, removePeer } = require("./peerManager");
const Blockchain = require("../src/blockchain/blockchain");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;
const peers = new Set(getPeers());

const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use("/api", blockchainRoutes);

// Register node and add itself to peer list
const registerNode = async () => {
  const selfUrl = `http://localhost:${port}`;
  addPeer(selfUrl);

  const peers = ["http://localhost:3002", "http://localhost:3003"];

  for (const peer of peers) {
    try {
      await fetch(`${peer}/add-peer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peer: selfUrl }),
      });
      console.log(`Successfully registered with ${peer}`);
    } catch (error) {
      console.error(`Failed to register with peer ${peer}`, error);
    }
  }
};

// Add a new peer node
app.post("/add-peer", (req, res) => {
  const { peer } = req.body;
  if (!peers.has(peer)) {
    peers.add(peer);
    addPeer(peer);
  }
  res.json({ message: `Peer ${peer} added successfully` });
});

// Broadcast a message to all peers
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

// Create a new transaction and broadcast it to peers
app.post("/api/transaction", (req, res) => {
  const { amount, sender, recipient } = req.body;
  if (amount <= 0 || !sender || !recipient) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  const blockIndex = blockchain.createNewTransaction(amount, sender, recipient);
  broadcast("/api/transaction", req.body); // Broadcast the transaction to peers
  res
    .status(201)
    .json({ message: `Transaction will be added in block ${blockIndex}` });
});

// Mine a new block and broadcast it to peers
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

  broadcast("/api/blockchain", { chain: blockchain.chain }); // Broadcast the new block to peers
  res
    .status(201)
    .json({ message: "New block mined successfully", block: newBlock });
});

// Sync blockchain data from peers
app.use(bodyParser.json());
app.post("/sync", (req, res) => {
  try {
    const { chain } = req.body;
    if (!Array.isArray(chain)) {
      throw new Error("Invalid data format: chain should be an array");
    }
    // Process the blockchain data
    console.log("Received blockchain data:", chain);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error processing /sync request:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get the status of the node
app.get("/status", (req, res) => {
  const status = {
    port: port,
    peers: Array.from(peers),
  };
  res.json(status);
});

// Get the list of peers
app.get("/peers", (req, res) => {
  res.json(Array.from(peers));
});

// Remove a peer from the list
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