/**
 * Wrapper for CountdownGriefingEscrow factory and template
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { ESCROW_STATUS } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow extends Template {
  constructor(wallet, provider) {
    super(Contracts.CountdownGriefingEscrow, wallet, provider);
  }

  //====Class methods====//
  static async create(
    buyer,
    seller,
    paymentAmount,
    stakeAmount,
    escrowCountdown,
    metadata,
    agreementParams,
    wallet,
    provider,
    operator = null,
    salt = null,
    network = null
  ) {
    if (!network) {
      network = await provider.getNetwork();
      network = network.name;
    }
    let factory = new CountdownGriefingEscrow_Factory(
      wallet,
      provider,
      network
    );
    let [tx, instanceAddress] = await factory.create(
      buyer,
      seller,
      paymentAmount,
      stakeAmount,
      escrowCountdown,
      metadata,
      agreementParams,
      operator,
      salt
    );
    return new CountdownGriefingEscrow(instanceAddress, wallet, provider);
  }

  //====MODIFIERS====//
  async onlySellerOrOperator() {
    let seller = await this.getSeller();
    let operator = await this.getOperator();
    assert(
      seller == this.wallet.address || operator == this.wallet.address,
      "Only seller or operator can perform this method"
    );
  }
  async onlyBuyerOrOperator() {
    let buyer = await this.getBuyer();
    let operator = await this.getOperator();
    assert(
      buyer == this.wallet.address || operator == this.wallet.address,
      "Only buyer or operator can perform this method"
    );
  }
  async onlyOpen() {
    let escrowStatus = await this.getEscrowStatus();
    assert.equal(escrowStatus, ESCROW_STATUS.isOpen, "Escrow has to be open");
  }
  async onlyPaymentDeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert.equal(
      escrowStatus,
      ESCROW_STATUS.onlyPaymentDeposited,
      "Payment has to be desposited"
    );
  }
  async onlyStakeDeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert.equal(
      escrowStatus,
      ESCROW_STATUS.onlyStakeDeposited,
      "Stake has to be deposited"
    );
  }
  async onlyOpenOrStakedeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert(
      escrowStatus == ESCROW_STATUS.isOpen ||
        escrowStatus == ESCROW_STATUS.onlyStakeDeposited,
      "Escrow has to be open or stake deposited"
    );
  }
  async onlyDeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert.equal(
      escrowStatus,
      ESCROW_STATUS.isDeposited,
      "Escrow has to be deposited"
    );
  }
  async onlyFinalized() {
    let escrowStatus = await this.getEscrowStatus();
    assert.equal(
      escrowStatus,
      ESCROW_STATUS.isFinalized,
      "Escrow has to be finalized"
    );
  }

  //===== State Methods ====//
  /**
   * If sellet is not set -> set seller
   * If buyer is already deposit payment => finalize
   */
  async depositStake() {
    await this.onlySellerOroperator();
    await this.onlyOpen();
    await this.onlyPaymentDeposited();
    let tx = await this.contract.depositStake();
    return await tx.wait();
  }
  async depositPayment() {
    await this.onlyBuyerOrOperator();
    await this.onlyOpenOrStakedeposited();
    let tx = await this.contract.depositPayment();
    return await tx.wait();
  }
  async finalize() {
    await this.onlySellerOrOperator();
    await this.onlyDeposited();
    let tx = await this.contract.finalize();
    return await tx.wait();
  }
  async submitData(data) {
    await this.onlySellerOrOperator();
    await this.onlyFinalized();
    let hashData = ethers.utils.keccak256(ethers.utils.hexlify(data));
    let tx = await this.contract.submitData(hashData);
    return await tx.wait();
  }
  async cancel() {
    await this.onlySellerOrOperator();
    await this.onlyBuyerOrOperator();
    await this.onlyOpen();
    await this.onlyStakeDeposited();
    let tx = await this.contract.cancel();
    return await tx.wait();
  }
  async timeout() {
    await this.onlyBuyerOrOperator();
    await this.onlyDeposited();
    let tx = await this.contract.timeout();
    return await tx.wait();
  }

  //====Getters====//
  async getBuyer() {
    return await this.contract.getBuyer();
  }
  async isBuyer(caller) {
    return await this.contract.isBuyer(ethers.utils.getAddress(caller));
  }
  async getSeller() {
    return await this.contract.getSeller();
  }
  async isSeller(caller) {
    return await this.contract.isSeller(ethers.utils.getAddress(caller));
  }
  async getData() {
    return await this.contract.getData();
  }
  async getEscrowStatus() {
    return await this.contract.getEscrowStatus();
  }
}
module.exports = { CountdownGriefingEscrow };
