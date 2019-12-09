/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, abiEncodeWithSelector, hexlify, AGREEMENT_TYPE } = require("../Utils");
const { Factory, Contracts } = require("../Base");

class Agreement_Factory extends Factory {
  constructor({ wallet, provider, network = null }) {
    network = network || "mainnet";
    if (this.type == AGREEMENT_TYPE.COUNTDOWN) {
      super({ contract: Contracts.CountdownGriefing, wallet, network, provider });
    } else {
      super({ contract: Contracts.SimpleGriefing, wallet, network, provider });

    }
  }
  async create({
    staker,
    counterparty,
    ratio,
    ratioType,
    countdownLength,
    metaData,
    ipfs,
    graph,
    operator = null,
    salt = null }
  ) {
    if (operator) {
      operator = ethers.utils.getAddress(operator);
    }
    let callData = abiEncodeWithSelector(
      "initialize",
      ["address", "address", "address", "uint256", "uint8", "uint256", "bytes"],
      [
        operator || NULL_ADDRESS,
        ether.utils.getAddress(staker),
        ethers.utils.getAddress(counterparty),
        ethers.utils.bigNumberify(ratio),
        ethers.utils.bigNumberify(ratioType),
        ethers.utils.bigNumberify(countdownLength),
        ethers.utils.keccak256(hexlify(metaData))
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
    const agreement = new Agreement({ address: createdEvent.address, wallet: this.wallet, provider: this.provider, ipfs, graph })
    return { confirmedTx, agreement };
  }
}

module.exports = { Agreement_Factory };
