/**
 * Create new Feed
 * Create post and stake
 */

const { Factory, Contracts } = require("../Base");
const { ethers } = require("ethers");
const assert = require("assert");
const {ErasureFeed} = require("./ErasureFeed")
const { NULL_ADDRESS, abiEncodeWithSelector, hexlify } = require("../Utils");

/**
 * Create Feed from factory
 * Get all feeds from registries
 * listen to Feeds and Posts related event
 */
class Feed_Factory extends Factory {
    constructor({ wallet, provider, network = "mainnet" }) {
        super({ contract: Contracts.Feed, wallet, network, provider });
    }

    /**
   * Create New Feed == Deploy new Feed Template instance by Factory
   * Using nonce for new addrss
   * @param {*} param0
   */
    async create({ proof, metaData, operator = null, salt = null ,ipfs,graph}) {
        const proofHash = ethers.utils.sha256(hexlify(proof));
        const feedmetaData = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(metaData)
        );
        if (operator) {
            operator = ethers.utils.getAddress(operator);
        }
        let callData = abiEncodeWithSelector(
            "initialize",
            ["address", "bytes32", "bytes"],
            [operator || NULL_ADDRESS, proofHash, feedmetaData]
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
        try {
            assert(createdEvent.args.instance, "No new instance's address found");
            let feed = new ErasureFeed({ address: createdEvent.args.instance, wallet: this.wallet, provider: this.provider,ipfs,graph})
            return { confirmedTx, feed };
        } catch (e) {
            return { confirmedTx, error: "Feed creation failed" }
        }
    }
}

module.exports = { Feed_Factory };
