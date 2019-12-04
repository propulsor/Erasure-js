/**
 * Wrapper for CountdownGriefingEscrow factory and template
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { ESCROW_STATUS } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow extends Template {
  constructor({ address, wallet, provider }) {
    super({
      contract: Contracts.CountdownGriefingEscrow,
      wallet,
      provider,
      address
    });
  }

  //====Class methods====//
  static async create({
    paymentAmount,
    stakeAmount,
    escrowCountdown,
    ratio,
    ratioType,
    agreementCountdown,
    wallet,
    provider,
    buyer = null,
    seller = null,
    operator = null,
    metadata = null,
    salt = null,
    network = null
  }) {
    if (!network) {
      network = await provider.getNetwork();
      network = network.name;
    }
    let factory = new CountdownGriefingEscrow_Factory(
      wallet,
      provider,
      network
    );
    let agreementParams = encoder(
      ["uint120", "uint8", "uint128"],
      [ratio, ratioType, agreementCountdown]
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
  async onlyOpenOrPaymentDeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert(
      escrowStatus == ESCROW_STATUS.onlyPaymentDeposited ||
        escrowStatus == ESCROW_STATUS.isOpen,
      "Escrow status has to be open or payment deposited"
    );
  }

  /**
   * buyer || seller || operator
   * isOpen || paymentDeposit || stakeDesposited
   */
  async cancelCondition() {
    let escrowStatus = await this.getEscrowStatus();
    let seller = await this.getSeller();
    let buyer = await this.getBuyer();
    let operator = await this.getOperator();
    return (
      [
        ESCROW_STATUS.isOpen,
        ESCROW_STATUS.onlyStakeDeposited,
        ESCROW_STATUS.onlyPaymentDeposited
      ].includes(escrowStatus) &&
      [seller, buyer, operator].includes(this.wallet.address)
    );
  }

  async onlyOpenOrStakedeposited() {
    let escrowStatus = await this.getEscrowStatus();
    assert(
      escrowStatus == ESCROW_STATUS.isOpen ||
        escrowStatus == ESCROW_STATUS.onlyStakeDeposited,
      "Escrow status has to be open or stake deposited"
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
    await this.onlyOpenOrPaymentDeposited();
    let seller = await this.getSeller();
    let tx;
    if (!seller) {
      //deposit and set seller
      tx = await this.contract.depositAndSetSeller(this.wallet.address);
    } else {
      await this.onlySellerOroperator(); //check if wallet is seller or operator
      tx = await this.contract.depositStake();
    }

    return await tx.wait();
  }

  /**
   * Buyer deposit payment,
   * If there is no current buyer, this wallet become buyer
   */
  async depositPayment() {
    await this.onlyOpenOrStakedeposited();
    let tx;
    let buyer = await this.getBuyer();
    if (!buyer) {
      tx = await this.contract.depositAndSetBuyer(this.wallet.address);
    } else {
      await this.onlyBuyerOrOperator();
      tx = await this.contract.depositPayment();
    }
    return await tx.wait();
  }

  /**
   * Seller/Operator Finalize escrow and start countdown
   */
  async finalize() {
    await this.onlySellerOrOperator();
    await this.onlyDeposited();
    let tx = await this.contract.finalize();
    return await tx.wait();
  }

  /**
   * Seller submit data to the buyer
   * @param {any format} data
   */
  async submitData(data) {
    await this.onlySellerOrOperator();
    await this.onlyFinalized();
    let hashData = ethers.utils.keccak256(ethers.utils.hexlify(data));
    let tx = await this.contract.submitData(hashData);
    return await tx.wait();
  }

  /**
   * Cancel when tehre is no interested counterparty
   */
  async cancel() {
    assert(await this.cancelCondition(), "Cancel condition is not met");
    let tx = await this.contract.cancel();
    return await tx.wait();
  }

  /**
   * Cancel when seller doesnt finalize
   */
  async timeout() {
    await this.onlyBuyerOrOperator();
    await this.onlyDeposited();
    await this.onlyCountdownOver();
    let tx = await this.contract.timeout();
    return await tx.wait();
  }

  //====Getters====//
  async getBuyer() {
    return await this.contract.getBuyer();
  }
  async isBuyer(caller=null) {
    return await this.contract.isBuyer(ethers.utils.getAddress(caller||this.wallet.address));
  }
  async getSeller() {
    return await this.contract.getSeller();
  }
  async isSeller(caller=null) {
    return await this.contract.isSeller(ethers.utils.getAddress(caller||this.wallet.address));
  }
  /**
   * Data about this Escrow :
   * - paymentAmount, stakeAmount, ratio, ratioType, countdownLength
   */
  async getData() {
    const data = await this.contract.getData();
    return data;
  }
  async getEscrowStatus() {
    return await this.contract.getEscrowStatus();
  }
}
module.exports = { CountdownGriefingEscrow };
