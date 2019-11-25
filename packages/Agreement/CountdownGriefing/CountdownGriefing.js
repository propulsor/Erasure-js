/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, AGREEMENT_STATUS, hexlify } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CoundownGriefing extends Template {
  constructor(wallet, provider) {
    super(Contracts.CountdownGriefing, wallet, provider);
  }

  async onlyNotTerminated() {
    let agreementStatus = await this.getAgreementStatus();
    assert.notEqual(
      agreementStatus,
      AGREEMENT_STATUS.isTerminated,
      "Agreement is already terminated"
    );
  }

  async onlyCounterparty() {
    let counterparty = await this.getCounterParty();
    assert.equal(
      counterparty,
      this.wallet.address,
      "Only Operator can perform this method"
    );
  }

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
  /**
   * Only staker can increate the stake
   * Only can be done when agreement is not terminated
   * @param {*} amount
   */
  async increateStake(amount) {
    await this.onlyNotTerminated();
    await this.onlyStakerOrOperator();
    let tx = await this.contract.increaseStake(
      ethers.utils.bigNumberify(amount)
    );
    let confirmedTx = await tx.wait();
    let newStakeAmount = await this.getCurrentStake();
    return [confirmedTx, newStakeAmount];
  }
  /**
   * Only counterparty can reward staker
   * @param {} amount
   */
  async reward(amount) {
    await this.onlyNotTerminated();
    await this.onlyCounterparty();
    let tx = await this.contract.reward(ethers.utils.bigNumberify(amount));
    let confirmedTx = await tx.wait();
    let newStakeAmount = await this.getCurrentStake();
    return [confirmedTx, newStakeAmount];
  }
  /**
   * Only Counterparty and not terminated
   * @param {*} amount
   */
  async punish(amount, message) {
    await this.onlyCounterpartyOrOperator();
    await this.onlyNotTerminated();
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
  /**
   * Only staker or operator
   */
  async startCountDown() {
    await this.onlyStakerOrOperator();
    await this.onlyWhenInitialized();
    //todo only when countdown is not started
    let tx = await this.contract.startCountDown();
    let confirmedTx = await tx.wait();
    let deadline = confirmedTx.deadline; //TODO get deadline from confirmedTx
    return [confirmedTx, deadline];
  }
  /**
   * Only staker or operator
   * Only when countdown is over
   * @param {*} destAddress
   */
  async retrieveStake(destAddress = null) {
    await this.onlyStakerOrOperator();
    //todo only when countdown is over
    let tx = await this.contract.retrieveStake(destAddress || NULL_ADDRESS);
    let confirmedTx = await tx.wait();
    let amount = confirmedTx.amount; //TODO get amount from confirmedTx
    return [confirmedTx, amount];
  }
  //GETTERS
  async getStaker() {
    return await this.contract.getStaker();
  }
  async isStaker(caller) {
    return await this.contract.isStaker(ethers.utils.getAddress(caller));
  }
  async getCounterParty() {
    return await this.contract.getCounterParty();
  }
  async isCounterparty(caller) {
    return await this.contract.isCounterparty(ethers.utils.getAddress(caller));
  }
  async getCurrentStake() {
    return await this.contract.getCurrentStake();
  }
  async isStaked() {
    return await this.contract.isStaked();
  }
  async getAgreementStatus() {
    return await this.contract.getAgreementStatus();
  }
}

module.exports = { CoundownGriefing };
