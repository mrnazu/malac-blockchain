const assert = require('assert');
const Blockchain = require('../src/blockchain/blockchain');
const sha256 = require('sha256');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe('Hashing', () => {
    it('should hash the block correctly', () => {
      const prvHash = 'b94d27b9934d3e08a52e52d7da7dabfac484e';
      const currentBlock = {
        index: 1,
        timestamp: 1720019320655,
        tx: [],
        nonce: '0x12345678',
        prvHash: 'b94d27b9934d3e08a52e52d7da7dabfac484e'
      };
      const nonce = '0x12345678';

      const dataString = prvHash + nonce.toString() + JSON.stringify(currentBlock);
      const expectedHash = sha256(dataString);

      const actualHash = blockchain.hashBlock(prvHash, currentBlock, nonce);
      assert.equal(actualHash, expectedHash);
      console.log(`Actual Hash: ${actualHash}`);
      console.log(`Expected Hash: ${expectedHash}`);
    });
  });
});
