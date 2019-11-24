/**
 * Create new Feed
 * Create post and stake
 */

const {Factory} = require("../../Base");
const { ethers } = require("ethers");
const { abiEncodeWithSelector, hexlify } = require("../../Utils");
const NULL_ADDRESS = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);
/**
 * Create Feed from factory
 * Get all feeds from registries
 * listen to Feeds and Posts related event
 */
console.log("FACTORY",Factory)
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
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "bytes32", "bytes"],
      [operator || NULL_ADDRESS, proofHash, feedMetadata]
    );
    let tx = await this.contract.create(callData);
    return tx.await();
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
    let callData = this.interface.encodeFunctionData(
      this.interface.initialize,
      [operator, proofHash, feedMetadata, salt]
    );
    let tx = await this.contract.create(callData);
    return tx.await();
  }


}

module.exports = { ErasureFeed_Factory };
