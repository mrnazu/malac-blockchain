// src/consensus/pow.js

const sha256 = require('sha256');

function hashBlock(prvHash, currentBlock, nonce) {
  const dataString = prvHash + nonce.toString() + JSON.stringify(currentBlock);
  return sha256(dataString);
}

function proofOfWork(prvHash, currentBlock, difficulty) {
  let nonce = 0;
  let hash;
  const prefix = '0'.repeat(difficulty);

  do {
    nonce++;
    hash = hashBlock(prvHash, currentBlock, nonce);
  } while (hash.substring(0, difficulty) !== prefix);

  return { nonce, hash };
}

module.exports = { proofOfWork, hashBlock };