onst { Template } = require("../../Contracts/src");
const { ethers } = require("ethers");
const { abiEncodeWithSelector, hexlify } = require("../../Utils/utils");
const NULL_ADDRESS = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);
class ErasureFeed extends Template{
    /**
     * @param {} feedAddress 
     * @param {*} wallet 
     * @param {*} provider 
     */
    constructor(feedAddress,wallet,provider){
        //TODO check if wallet address is owner or operator
      super("Feed",feedAddress,wallet,provider)
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
        const feedMetadata = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(data)
          );
      let tx = await this.contract.setMetadata(feedMetadata);
      return tx.await();
    }
    //GETTER
  
    /**
     * Get Feed info of this creator
     */
    getFeedInfo() {}
    getOperator() {}
  
    //EVENTS
  
    /**
     * Get all Feeds available from subgraph
     */
    static async getAllFeeds() {}
  }
  