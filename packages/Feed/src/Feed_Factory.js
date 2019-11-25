/**
 * Create new Feed
 * Create post and stake
 */

const { Factory } = require("../../Base");
const { ethers } = require("ethers");
const assert = require("assert");
const { abiEncodeWithSelector, hexlify } = require("../../Utils");
const NULL_ADDRESS = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);
/**
 * Create Feed from factory
 * Get all feeds from registries
 * listen to Feeds and Posts related event
 */
class ErasureFeed_Factory extends Factory {
  constructor(wallet, network, provider, contracts = null) {
    super("Feed", wallet, network, provider, contracts);
  }
  /**
   * Create New Feed == Deploy new Feed Template instance by Factory
   * Using nonce for new addrss
   * @param {*} param0
   */
  async create(proof, metaData, operator = null) {
    const proofHash = ethers.utils.sha256(hexlify(proof));
    const feedMetadata = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(metaData)
    );
    if (operator) {
      operator = ethers.utils.getAddress(operator);
    }
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "bytes32", "bytes"],
      [operator || NULL_ADDRESS, proofHash, feedMetadata]
    );
    let tx = await this.contract.create(callData);
    let confirmedTx = await tx.wait();
    let createdEvent = confirmedTx.events.find(
      e => e.event == "InstanceCreated"
    );
    assert(createdEvent.args.instance, "No new instance's address found");
    // let newFeedInstance = new ErasureFeed(createdEvent.address,this.wallet,this.provider)
    return [confirmedTx, createdEvent.args.instance];
  }

  /**
   * Create new Feed == Deploy new Feed template instance
   * Using argument Salt for new address instead of nonce number
   * @param {*} proof
   * @param {*} metaData
   * @param {*} salt
   * @param {*} operator
   */
  async createSalty(proof, metaData, salt, operator = null) {
    const proofHash = ethers.utils.sha256(hexlify(proof));
    const feedMetadata = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(metaData)
    );
    salt = ethers.utils.formatBytes32String(salt)
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "bytes32", "bytes"],
      [operator || NULL_ADDRESS, proofHash, feedMetadata]
    );
    let tx = await this.contract.createSalty(callData, salt);
    let confirmedTx = await tx.wait();
    let createdEvent = confirmedTx.events.find(e => e.event == "InstanceCreated");
    assert(createdEvent.args.instance);
    return [confirmedTx, createdEvent.args.instance];
  }
}

module.exports = { ErasureFeed_Factory };
