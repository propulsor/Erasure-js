const assert = require("assert");
const { ethers } = require("ethers");
const {
  hexlify,
  abiEncodeWithSelector,
  NULL_ADDRESS,
  wallet,
  operatorWallet,
  provider
} = require("../utils");
const { Contracts } = require("../../packages/Base");
const { ErasureFeed_Factory } = require("../../packages/Feed/src/Feed_Factory");

describe("Feed Factory", function() {
  const PROOF = "proof",
    METADATA = "metadata",
    SALT = "salt";
  const proofHash = ethers.utils.sha256(hexlify(PROOF));
  const metaDataHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(METADATA)
  );
  let Feed_Factory;
  function getFeedInstance(feedAddress) {
    return new ethers.Contract(
      feedAddress,
      Contracts["Feed"].template.artifact.abi,
      provider
    );
  }
  describe("Feed Factory", function() {
    it("1.Should Initialize Feed Factory class with wallet", done => {
      Feed_Factory = new ErasureFeed_Factory(wallet, "ganache", provider);

      done();
    });
    it("2. Should create new feed WITHOUT salt, WITHOUT operator", async () => {
      let [tx, newFeedAddress] = await Feed_Factory.create(PROOF, METADATA);
      let callData = abiEncodeWithSelector(
        "initialize",
        ["address", "bytes32", "bytes"],
        [NULL_ADDRESS, proofHash, metaDataHash]
      );
      let newFeedEvent = tx.events.find(
        e => e.event == "InstanceCreated",
        "No InstanceCreated event found"
      );
      assert.equal(newFeedEvent.args.callData, callData);
      let instanceContract = getFeedInstance(newFeedAddress);
      let actualCreator = await instanceContract.getCreator();
      assert.equal(actualCreator, wallet.address);
      let actualOperator = await instanceContract.getOperator();
      assert.equal(actualOperator, NULL_ADDRESS);
    });
    it("3. Should create new feed WITHOUT salt, WITH operator", async () => {
      let [tx, feedAddress] = await Feed_Factory.create(
        PROOF,
        METADATA,
        (operator = operatorWallet.address)
      );

      let callData = abiEncodeWithSelector(
        "initialize",
        ["address", "bytes32", "bytes"],
        [
          ethers.utils.getAddress(operatorWallet.address),
          proofHash,
          metaDataHash
        ]
      );
      let newFeedEvent = tx.events.find(
        e => e.event == "InstanceCreated",
        "No InstanceCreated event found"
      );
      assert.equal(newFeedEvent.args.callData, callData);
      let instanceContract = getFeedInstance(feedAddress);
      let actualCreator = await instanceContract.getCreator();
      let actualOperator = await instanceContract.getOperator();
      assert.equal(actualCreator, wallet.address, "wrong creator");
      assert.equal(actualOperator, operatorWallet.address, "wrong operator");
    });
    it("4. Should create new feed WITH salt WITHOUT operator", async () => {
      let [tx, feedAddress] = await Feed_Factory.createSalty(
        PROOF,
        METADATA,
        SALT,
        (operator = null)
      );
      let callData = abiEncodeWithSelector(
        "initialize",
        ["address", "bytes32", "bytes"],
        [NULL_ADDRESS, proofHash, metaDataHash]
      );
      let newFeedEvent = tx.events.find(
        e => e.event == "InstanceCreated",
        "No InstanceCreated event found"
      );
      assert(newFeedEvent.args.instance, "No address for new instance");
      assert.equal(newFeedEvent.args.callData, callData);
      let instanceContract = getFeedInstance(feedAddress);
      let actualCreator = await instanceContract.getCreator();
      let actualOperator = await instanceContract.getOperator();
      assert.equal(actualCreator, wallet.address, "wrong creator");
      assert.equal(actualOperator, NULL_ADDRESS, "wrong operator");
    });
    it("5. Should create new feed WITH salt WITH operator", async () => {
      let [tx, feedAddress] = await Feed_Factory.createSalty(
        PROOF,
        METADATA,
        SALT + "1",
        (operator = operatorWallet.address)
      );
      let callData = abiEncodeWithSelector(
        "initialize",
        ["address", "bytes32", "bytes"],
        [operatorWallet.address, proofHash, metaDataHash]
      );
      let newFeedEvent = tx.events.find(
        e => e.event == "InstanceCreated",
        "No InstanceCreated event found"
      );
      assert(newFeedEvent.args.instance, "No address for new instance");
      assert.equal(newFeedEvent.args.callData, callData);
      let instanceContract = getFeedInstance(feedAddress);
      let actualCreator = await instanceContract.getCreator();
      let actualOperator = await instanceContract.getOperator();
      assert.equal(actualCreator, wallet.address, "wrong creator");
      assert.equal(actualOperator, operatorWallet.address, "wrong operator");
    });
    // it("7. Should get all current feeds from registries", async () => {});
  });
});
