const { Template, Contracts } = require("../../Base");
const { ethers } = require("ethers");
const { hexlify } = require("../../Utils");
const { ErasureFeed_Factory } = require("./Feed_Factory");

class ErasureFeed extends Template {
  /**
   * @param {} feedAddress
   * @param {*} wallet
   * @param {*} provider
   */
  constructor(feedAddress, wallet, provider) {
    //TODO check if wallet address is owner or operator
    super(Contracts.Feed, feedAddress, wallet, provider);
  }

  /**
   * Submit proofHash to add to feed
   * @param {*} param0 : proof is normally an IPFS hash
   */
  async submitProof(proof) {
    const proofHash = ethers.utils.keccak256(hexlify(proof));
    let tx = await this.contract.submitHash(proofHash);
    return await tx.wait();
  }

  /**
   *Override setMetadata method because Feed creator can also set metadata
   * @param {*} data
   */
  async setMetadata(data) {
    const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
    let tx = await this.contract.setMetadata(feedMetadata);
    return await tx.wait();
  }

  /**
   * We allow optional for network because ganache and ethers dont work well together on network name
   * @param {} proof
   * @param {*} metadata
   * @param {*} operator
   * @param {*} wallet
   * @param {*} provider
   * @param {*} network
   */
  static async createFeed(
    proof,
    metadata,
    operator = null,
    wallet,
    provider,
    network = null,
    salt = null
  ) {
    if (!network) {
      network = await provider.getNetwork();
      network = network.name;
    }
    let factory = new ErasureFeed_Factory(wallet, provider, network);
    let tx, feedAddress;
    if (salt) {
      [tx, feedAddress] = await factory.create(proof, metadata, operator, salt);
    } else {
      [tx, feedAddress] = await factory.create(proof, metadata, operator);
    }
    return new ErasureFeed(feedAddress, wallet, provider);
  }

  //GETTER

  //EVENTS
}

module.exports = { ErasureFeed };
