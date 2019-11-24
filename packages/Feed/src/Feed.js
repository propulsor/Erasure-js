const { Template } = require("../../Base");
const { ethers } = require("ethers");
const { abiEncodeWithSelector, hexlify } = require("../../Utils");
const NULL_ADDRESS = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);
class ErasureFeed extends Template {
  /**
   * @param {} feedAddress
   * @param {*} wallet
   * @param {*} provider
   */
  constructor(feedAddress, wallet, provider) {
    //TODO check if wallet address is owner or operator
    super("Feed", feedAddress, wallet, provider);
  }

  /**
   * Submit proofHash to add to feed
   * @param {*} param0
   */
  async submitHash(proof) {
    const proofHash = ethers.utils.sha256(hexlify(proof));
    let tx = await this.contract.submitHash(proofHash);
    return tx.await();
  }

  /**
   * set metadata
   * @param {*} data
   */
  async setMetadata(data) {
    const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
    let tx = await this.contract.setMetadata(feedMetadata);
    return tx.await();
  }

  /**
   * Tranfer permit from old to new operator, has to be operator or creator
   * @param {*} newOperator
   */
  async transferOperator(newOperator) {
    let tx = await this.contract.transferOperator(newOperator);
    return tx.await();
  }

  /**
   * Renounce operator,
   * Has to be operator or creator
   */
  async renounceOperator() {
    let tx = await this.contract.renounceOperator();
    return tx.await();
  }

  //GETTER

  //EVENTS
}
