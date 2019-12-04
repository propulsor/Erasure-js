const { Template, Contracts } = require("../../Base");
const { ethers } = require("ethers");
const { hexlify } = require("../../Utils");
const { Feed_Factory } = require("./Feed_Factory");

class Feed extends Template {
  /**
   * @param {} feedAddress
   * @param {*} wallet
   * @param {*} provider
   */
  constructor({address=null, wallet, provider}) {
    //TODO check if wallet address is owner or operator
    super({contract:Contracts.Feed, address, wallet, provider});
  }

  //==== Class methods ====//
    /**
   * We allow optional for network because ganache and ethers dont work well together on network name
   * @param {} proof
   * @param {*} metadata
   * @param {*} operator
   * @param {*} wallet
   * @param {*} provider
   * @param {*} network
   */
  static async create(
    {proof,
    metadata,
    wallet,
    provider,
    operator = null,
    salt = null,
    network = null
    }
  ) {
    if (!network) {
      network = await provider.getNetwork();
      network = network.name;
    }
    let factory = new Feed_Factory({wallet, provider, network});
    let [tx, instanceAddress] = await factory.create({proof, metadata, operator, salt});
    return new Feed({address:instanceAddress, wallet, provider});
  }
  
  //==== State methods ====//
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
  
}

module.exports = { Feed };
