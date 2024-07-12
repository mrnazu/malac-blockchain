// api/peerManager.js

const fs = require("fs");
const path = require("path");

const PEER_FILE_PATH = path.join(__dirname, "peers.json");

const loadPeers = () => {
  if (fs.existsSync(PEER_FILE_PATH)) {
    const data = fs.readFileSync(PEER_FILE_PATH);
    return JSON.parse(data);
  }
  return [];
};

const savePeers = (peers) => {
  fs.writeFileSync(PEER_FILE_PATH, JSON.stringify(peers, null, 2));
};

const addPeer = (peer) => {
  const peers = loadPeers();
  if (!peers.includes(peer)) {
    peers.push(peer);
    savePeers(peers);
  }
};

const getPeers = () => loadPeers();

const removePeer = (peer) => {
  let peers = loadPeers();
  peers = peers.filter(existingPeer => existingPeer !== peer);
  savePeers(peers);
};

module.exports = { addPeer, getPeers, removePeer };