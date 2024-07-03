// test/blockchain.test.js

const assert = require("assert");
const Blockchain = require("../src/blockchain/blockchain");

describe("Blockchain", () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe("NewBlock", () => {
    it("should create a new block", () => {
      const newBlock = blockchain.NewBlock("0x12345678", "b94d27b9934d3e08a52e52d7da7dabfac484e", "d7a8fbb307d7809469ca9abcb0082e4f");
      assert.ok(newBlock, "New block should be created");
      assert.equal(blockchain.chain.length, 2); // including the genesis block
      console.log("New Block Data:", newBlock);
    });

    it("should create multiple new blocks", () => {
      const newBlock1 = blockchain.NewBlock("0x12345678", "b94d27b9934d3e08a52e52d7da7dabfac484e", "d7a8fbb307d7809469ca9abcb0082e4f");
      const newBlock2 = blockchain.NewBlock("0x1212126", "32302940f7a81396e789816813f9", "425c989300451428c8548037052f16b25649");
      const newBlock3 = blockchain.NewBlock("0x3343434", "fe37a5380ee9088f7ace2efcde9", "8d5651e46d3cdb761904a5c35070627f");

      assert.ok(newBlock1, "New block 1 should be created");
      assert.ok(newBlock2, "New block 2 should be created");
      assert.ok(newBlock3, "New block 3 should be created");

      console.log("New Block Data:");
      console.log(newBlock1);
      console.log(newBlock2);
      console.log(newBlock3);

      assert.equal(blockchain.chain.length, 4); // including the genesis block
    });
  });

  describe("Transactions", () => {
    it("should create a new transaction", () => {
      blockchain.createNewTransaction(100, 'NAZUxb94d27b9934d3e08a52', 'SAMxd7a8fbb307d7809469ca9ab');
      assert.equal(blockchain.UTXO.length, 1);
      console.log("Current Transactions:", blockchain.UTXO);
    });

    it("should clear UTXO after creating a new block", () => {
      blockchain.createNewTransaction(100, 'NAZUxb94d27b9934d3e08a52', 'SAMxd7a8fbb307d7809469ca9ab');
      const newBlock = blockchain.NewBlock("0x12345678", "b94d27b9934d3e08a52e52d7da7dabfac484e", "d7a8fbb307d7809469ca9abcb0082e4f");
      assert.equal(blockchain.UTXO.length, 0);
      console.log("New Block Data with Transactions:", newBlock);
    });
  });
});
