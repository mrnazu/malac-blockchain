const assert = require("assert");
const Blockchain = require("../src/blockchain/blockchain");

describe("Proof of Work", () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it("should find a valid nonce and hash that meets the difficulty criteria", () => {
    const prvHash = "b94d27b9934d3e08a52e52d7da7dabfac484e";
    const currentBlock = {
      index: 1,
      timestamp: Date.now(),
      transactions: [],
      nonce: "0x0",
      hash: "0x0"
    };
    const difficulty = 3; // Adjust difficulty for faster testing

    const result = blockchain.proofOfWork(prvHash, currentBlock, difficulty);

    assert.ok(result.nonce > 0, "Nonce should be greater than 0");
    assert.ok(result.hash.substring(0, difficulty) === '0'.repeat(difficulty), `Hash should start with ${'0'.repeat(difficulty)}`);
    console.log(`Nonce: ${result.nonce}`);
    console.log(`Hash: ${result.hash}`);
  });

  it("should produce consistent hashes for the same input", () => {
    const prvHash = "b94d27b9934d3e08a52e52d7da7dabfac484e";
    const currentBlock = {
      index: 1,
      timestamp: Date.now(),
      transactions: [],
      nonce: "0x0",
      hash: "0x0"
    };
    const difficulty = 3;

    const result1 = blockchain.proofOfWork(prvHash, currentBlock, difficulty);
    const result2 = blockchain.proofOfWork(prvHash, currentBlock, difficulty);

    assert.equal(result1.hash, result2.hash, "Hashes should be consistent");
    assert.equal(result1.nonce, result2.nonce, "Nonces should be consistent");
  });
});
