/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, abiEncodeWithSelector, hexlify } = require("../../Utils");
const { Factory, Contracts } = require("../../Base");

class SimpleGriefing_Factory extends Factory {
  constructor({wallet, provider, network = null}) {
    network = network || "mainnet";
    super({contract:Contracts.SimpleGriefing, wallet, network, provider});
  }
  async create({
    staker,
    counterparty,
    ratio,
    ratioType,
    metadata,
    operator = null,
    salt = null}
  ) {
    if (operator) {
      operator = ethers.utils.getAddress(operator);
    }
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "address", "address", "uint256", "uint8", "bytes"],
      [
        operator || NULL_ADDRESS,
        ethers.utils.getAddress(staker),
        ethers.utils.getAddress(counterparty),
        ethers.utils.bigNumberify(ratio),
        ethers.utils.bigNumberify(ratioType),
        ethers.utils.keccak256(hexlify(metadata))
      ]
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

module.exports = { SimpleGriefing_Factory };
