/**
 * Create new Feed
 * Create post and stake
 */

const { Factory } = require("../Base");
const { ethers } = require("ethers");
const assert = require("assert");
const {ErasureFeed} = require("./ErasureFeed")
const { abiEncodeWithSelector, hexlify } = require("../Utils");
const {NULL_ADDRESS,VERSIONS} = require("../Constants")
const ErasureHelper =require("@erasure/crypto-ipfs")
/**
 * Create Feed from factory
 * Get all feeds from registries
 * listen to Feeds and Posts related event
 */
class Feed_Factory extends Factory {
    constructor(opts) {
        super({ contractName: "FeedFactory", ...opts});
    }

    /**
   * Create New Feed == Deploy new Feed Template instance by Factory
   * Using nonce for new addrss
   * @param {*} param0
   */
    async create({ metaData, operator = null, salt = null ,ipfs,graph}) {
        const feedMetadata = await ErasureHelper.multihash({
            input: metaData,
            inputType: 'raw',
            outputType: 'hex',
          })
          let o = operator || NULL_ADDRESS
          console.log("operator here", o)
        o= ethers.utils.getAddress(o)
        let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes"],
                [o, feedMetadata]
            ); 
        let tx;
        if (salt) {
            console.log("CREATE with salt")
            tx = await this.contract.createSalty(
                callData,
                ethers.utils.formatBytes32String(salt)
            );
        } else {
            console.log("create no salt")
            tx = await this.contract.create(callData);
        }
        let confirmedTx = await tx.wait();
        let createdEvent = confirmedTx.events.find(
            e => e.event == "InstanceCreated"
        );
        try{
            assert(createdEvent.args.instance, "No new instance's address found");
            let feed = new ErasureFeed({ address: createdEvent.args.instance, wallet: this.wallet, provider: this.provider,version:this.version,network:this.network,ipfs,graph,contracts:this.contracts})
            return { confirmedTx, feed };
        } catch (e) {
            console.error(e)
            return { confirmedTx,error: "Feed creation failed" }
        }
    }
}

module.exports = { Feed_Factory };
