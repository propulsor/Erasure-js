/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, AGREEMENT_STATUS, AGREEMENT_TYPE } = require("../Utils");
const { Template, Contracts } = require("../Base");

class ErasureAgreement extends Template {

    constructor(opts) {
        if(!opts.type || opts.type==AGREEMENT_TYPE.COUNTDOWN){
            super({ contract:Contracts.CountdownGriefing, ...opts });
            this.type=AGREEMENT_TYPE.COUNTDOWN
        }
        else{
            super({contract : Contracts.SimpleGriefing,...opts})
            this.type=AGREEMENT_TYPE.SIMPLE
        }


    }

    //====Modifiers====//

    async onlyNotTerminated() {
        let agreementStatus = await this.status();
        assert.notEqual(
            agreementStatus,
            AGREEMENT_STATUS.isTerminated,
            "Agreement is already terminated"
        );
    }


    async onlyCounterpartyOrOperator() {
        let counterparty = await this.counterparty();
        let operator = await this.operator();
        assert(
            this.wallet.address == counterparty || this.wallet.address == operator,
            "only counterparty or operator can perform this method"
        );
    }

    async onlyStakerOrOperator() {
        let staker = await this.staker();
        let operator = await this.operator();
        assert(
            staker == this.wallet.address || operator == this.wallet.address,
            "Only staker or operator can perform this method"
        );
    }

    //====== State Methods====//

    /**
   * Only staker can increate the stake
   * Only can be done when agreement is not terminated
   * @param {*} amount
   */
    async increaseStake(amount) {
        await this.onlyNotTerminated();
        await this.onlyStakerOrOperator();
        let tx = await this.contract.increaseStake(
            ethers.utils.bigNumberify(amount)
        );
        let confirmedTx = await tx.wait();
        let newStakeAmount = await this.getCurrentStake();
        return {confirmedTx, newStakeAmount};
    }

    /**
   * Only counterparty can reward staker
   * @param {} amount
   */
    async reward(amount) {
        await this.onlyNotTerminated();
        await this.onlyCounterpartyOrOperator();
        let tx = await this.contract.reward(ethers.utils.bigNumberify(amount));
        let confirmedTx = await tx.wait();
        let newStakeAmount = await this.currentStake();
        return [confirmedTx, newStakeAmount];
    }

    /**
   * Only Counterparty and not terminated
   * @param {*} amount
   */
    async punish({ amount, message }) {
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
    async releaseStake(amount,message="") {
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
    async startCountdown() {
        assert.equal(this.type, AGREEMENT_TYPE.COUNTDOWN, "SimpleGriefing can't start countdown "+this.type)
        await this.onlyStakerOrOperator();
        //todo only when countdown is not started
        let tx = await this.contract.startCountdown();
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
        assert.equal(this.type, AGREEMENT_TYPE.COUNTDOWN, "SimpleGriefing cant retrieve stake")
        await this.onlyStakerOrOperator();
        //todo only when countdown is over
        let tx = await this.contract.retrieveStake(destAddress || NULL_ADDRESS);
        let confirmedTx = await tx.wait();
        let amount = confirmedTx.amount; //TODO get amount from confirmedTx
        return [confirmedTx, amount];
    }

    //==== Getters ====//
    async staker() {
        return await this.contract.getStaker();
    }

    async isStaker(caller) {
        return await this.contract.isStaker(ethers.utils.getAddress(caller));
    }

    async counterparty() {
        return await this.contract.getCounterparty();
    }

    async isCounterparty(caller) {
        return await this.contract.isCounterparty(ethers.utils.getAddress(caller));
    }

    async currentStake() {
        return await this.contract.getCurrentStake();
    }

    async isStaked() {
        return await this.contract.isStaked();
    }

    async status() {
        return await this.contract.getAgreementStatus();
    }
}

module.exports = { ErasureAgreement };
