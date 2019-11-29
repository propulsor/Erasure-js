/**
 * Create new Feed
 * Create post and stake
 */

const { Factory, Contracts } = require("../../Base");
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, abiEncodeWithSelector, hexlify } = require("../../Utils");

/**
 * Create Feed from factory
 * Get all feeds from registries
 * listen to Feeds and Posts related event
 */
class Feed_Factory extends Factory {
  constructor({wallet, provider, network = null}) {
    network = network || "mainnet";
    super({contract:Contracts.Feed, wallet, network, provider});
  }
  /**
   * Create New Feed == Deploy new Feed Template instance by Factory
   * Using nonce for new addrss
   * @param {*} param0
   */
  async create({proof, metadata, operator = null, salt = null}) {
    const proofHash = ethers.utils.sha256(hexlify(proof));
    const feedMetadata = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(metadata)
    );
    if (operator) {
      operator = ethers.utils.getAddress(operator);
    }
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "bytes32", "bytes"],
      [operator || NULL_ADDRESS, proofHash, feedMetadata]
    );
    let tx;
    if (salt) {
      tx = await this.contract.createSalty(
        callData,
        ethers.utils.formatBytes32String(salt)
      );
    } else {
      tx = await this.contract.create(callData);
    }
    let confirmedTx = await tx.wait();
    let createdEvent = confirmedTx.events.find(
      e => e.event == "InstanceCreated"
    );
    assert(createdEvent.args.instance, "No new instance's address found");
    // let newFeedInstance = new ErasureFeed(createdEvent.address,this.wallet,this.provider)
    return [confirmedTx, createdEvent.args.instance];
  }
}

module.exports = { Feed_Factory };
