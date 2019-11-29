/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { Template, Contracts } = require("../../Base");
const { SimpleGriefing_Factory } = require("./SimpleGriefing_Factory");

class SimpleGriefing extends Template {
  constructor({ address, wallet, provider }) {
    super({ contract: Contracts.SimpleGriefing, address, wallet, provider });
  }

  //====class method====//
  static async create({
    staker,
    counterparty,
    ratio,
    ratioType,
    metadata,
    wallet,
    provider,
    operator = null,
    salt = null,
    network = null
  }) {
    if (!network) {
      network = await provider.getNetwork();
      network = network.name;
    }
    let factory = new SimpleGriefing_Factory({wallet, provider, network});
    let [tx, instanceAddress] = await factory.create({
      staker,
      counterparty,
      ratio,
      ratioType,
      metadata,
      operator,
      salt
    });
    return new SimpleGriefing({ address: instanceAddress, wallet, provider });
  }

  //====Modifiers====//

  async onlyCounterpartyOrOperator() {
    let counterparty = await this.getCounterParty();
    let operator = await this.getOperator();
    assert(
      this.wallet.address == counterparty || this.wallet.address == operator,
      "only counterparty or operator can perform this method"
    );
  }

  async onlyStakerOrOperator() {
    let staker = await this.getStaker();
    let operator = await this.getOperator();
    assert(
      staker == this.wallet.address || operator == this.wallet.address,
      "Only staker or operator can perform this method"
    );
  }

  //====== State Methods====//


  /**
   * Only staker or operator can increase the stake
   * Only can be done when agreement is not terminated
   * @param {*} amount
   */
  async increaseStake(amount) {
    await this.onlyStakerOrOperator();
    let tx = await this.contract.increaseStake(
      ethers.utils.parseEther(amount)
    );
    let confirmedTx = await tx.wait();
    // let newStakeAmount = await this.getCurrentStake();
    return [confirmedTx, 0];
  }
  /**
   * Only counterparty can reward staker
   * @param {} amount
   */
  async reward(amount) {
    await this.onlyCounterpartyOrOperator();
    let tx = await this.contract.reward(ethers.utils.bigNumberify(amount));
    let confirmedTx = await tx.wait();
    let newStakeAmount = await this.getCurrentStake();
    return [confirmedTx, newStakeAmount];
  }
  /**
   * Only Counterparty and not terminated
   * @param {*} amount
   */
  async punish({ amount, message }) {
    await this.onlyCounterpartyOrOperator();
    let tx = await this.contract.punish(
      ethers.utils.bigNumberify(amount),
      ethers.utils.toUtf8Bytes(ethers.utils.hexlify(message))
    );
    let confirmedTx = await tx.wait();
    const cost = confirmedTx.cost; //todo get cost from tx returned
    return [confirmedTx, cost];
  }

  /**
   * Only counterparty or operator
   * @param {} amount
   */
  async releaseStake(amount) {
    await this.onlyCounterpartyOrOperator();
    let tx = await this.contract.punish(
      ethers.utils.bigNumberify(amount),
      ethers.utils.toUtf8Bytes(ethers.utils.hexlify(message))
    );
    let confirmedTx = await tx.wait();
    return confirmedTx;
  }

  //==== Getters ====//
  async getStaker() {
    return await this.contract.getStaker();
  }
  async isStaker(caller) {
    return await this.contract.isStaker(ethers.utils.getAddress(caller));
  }
  async getCounterparty() {
    return await this.contract.getCounterparty();
  }
  async isCounterparty(caller) {
    return await this.contract.isCounterparty(ethers.utils.getAddress(caller));
  }
  async getCurrentStake() {
    return await this.contract.getCurrentStake();
  }

  async getAgreementStatus() {
    return await this.contract.getAgreementStatus();
  }
}

module.exports = { SimpleGriefing };
