// test/blockchain.test.js

const assert = require("assert");

const Blockchain = require("../src/blockchain/blockchain");

describe("Blockchain", () => {
  describe("NewBlock", () => {
    it("should create a new block", () => {
      const handra = new Blockchain();
      const newBlock = handra.NewBlock(2024, "0xnewblockchainwcoin2024", "0xnewblockchainwcoin000");
      const newBlock2 = handra.NewBlock(121212, "0xnew121212blockchainwcoin2024", "0xnewbl12121212ockchainwcoin000");
      const newBlock3 = handra.NewBlock(3343434, "0xnew121212blockch343434ainwcoin2024", "0xnewbl12121212o3434ckchainwcoin000");

      assert.ok(newBlock, "New block should be created");
      assert.ok(newBlock2, "New block should be created");
      assert.ok(newBlock3, "New block should be created");

      console.log("New Block Data:");
      console.log(newBlock);
      console.log(newBlock2);
      console.log(newBlock3);

      assert.equal(handra.currentTransactions.length, 0);
    });
  });
});
