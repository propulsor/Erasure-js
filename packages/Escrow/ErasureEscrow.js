/**
 * Wrapper for CountdownGriefingEscrow factory and template
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { ESCROW_STATUS, createIpfsHash ,NULL_ADDRESS} = require("../Utils");
const { Template, Contracts } = require("../Base");
const ErasureHelper = require("@erasure/crypto-ipfs")
const {Erasure_Users} = require("../Registry")

class ErasureEscrow extends Template {
    constructor(opts) {
        super({ contract: Contracts.CountdownGriefingEscrow, ...opts });
        this.userRegistry = new Erasure_Users({wallet:opts.wallet,provider:opts.provider,network:opts.network})
    }

    //====MODIFIERS====//
    async onlySellerOrOperator() {
        let seller = await this.seller()
        let operator = await this.operator();
        console.log("seller : ", seller)
        assert(
            seller==NULL_ADDRESS || seller == this.wallet.address || operator == this.wallet.address,
            "Only seller or operator can perform this method"
        );
    }

    async onlyBuyerOrOperator() {
        let buyer = await this.buyer();
        let operator = await this.operator();
        assert(
            buyer==NULL_ADDRESS || buyer == this.wallet.address || operator == this.wallet.address,
            "Only buyer or operator can perform this method"
        );
    }

    async onlyOpen() {
        let escrowStatus = await this.status();
        assert.equal(escrowStatus, ESCROW_STATUS.isOpen, "Escrow has to be open");
    }

    async onlyOpenOrPaymentDeposited() {
        let escrowStatus = await this.status();
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
        let escrowStatus = await this.status();
        let seller = await this.seller();
        let buyer = await this.buyer();
        let operator = await this.operator();
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
        let escrowStatus = await this.status();
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

    //===== STATE METHODS ====//

    /**
   * If sellet is not set -> set seller
   * If buyer is already deposit payment => finalize
   */
    async depositStake() {
        await this.onlyOpenOrPaymentDeposited();
        let seller = await this.seller();
        let tx;
        if (!seller) {
            //deposit and set seller
            tx = await this.contract.depositAndSetSeller(this.wallet.address);
        } else {
            await this.onlySellerOrOperator(); //check if wallet is seller or operator
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
        let buyer = await this.buyer();
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

    /**
   * Deliver key of a purchase to escrow
   * Seller encrypted symkey with buyer's pubkey and upload to  escrow
   */
    async deliverKey({  symKey, proofIpfsPath }) {
        const status = await this.status()
        assert.equal(status, ESCROW_STATUS.isFinalized, "escrow is not finalized")
        const buyer = await this.buyer()
        const seller = await this.seller()
        assert.equal(seller, this.wallet.address, "you are not the seller of this escrow")
        const buyerPubkey = await this.userRegistry.getUser(buyer)
        // Encrypt symkey with buyer's pubkey
        const encryptedSymkey = crypto.publicEncrypt(buyerPubkey, Buffer.from(symKey))
        const json_selldata = {
            encryptedSymkey,
            proofIpfsPath
        }
        const selldataIpfsPath = await createIpfsHash(json_selldata)
        //send Encrypted symkey to escrow
        const confirmedTx = await this.submitData(selldataIpfsPath)
        const actualIPFSPath = await this.ipfs.addJSON(json_selldata)
        assert.equal(actualIPFSPath, selldataIpfsPath, "ipfs hash for sell data is not consistent")
        return confirmedTx

    }

    /**
   * Buyer call escrow to get encrypted symkey, decrypt, get encrypted data from ipfs, decrypt, return rawdata
   * If data is verified by sha256 -> call releaseStake for seller
   * @param {String} keypair of buyer used to decrypt symkey //fixme shouldnt pass in raw keypair
   * @return rawData:string
   */
    async retrieveDataFromSeller( keypair ) {
        const status = await this.status()
        const buyer = await this.buyer()
        assert.equal(buyer, this.wallet.address, "This wallet is not the buyer of this escrow")
        assert.equal(status, ESCROW_STATUS.isFinalized, "escrow is not finalized")
        //get submitted data from grapth based on the escrowAddress
        const dataSubmitted = await this.erasureGraph.getDataSubmitted(this.address)
        const dataSubmittedIPFS = await this.ipfsMini.catJSON(hexToHash(dataSubmitted))
        const encryptedSymkey = dataSubmittedIPFS.encryptedSymkey
        const proofIpfsPath = dataSubmittedIPFS.proofIpfsPath
        const proofData = await this.ipfsMini.catJSON(proofIpfsPath)
        //decrypt data with this user's privkey
        const decryptedSymkey = crypto.privateDecrypt(keypair.privateKey, Buffer.from(encryptedSymkey))
        //get path for encrypted data from escrow? //TODO
        const encryptedDataIpfsPath = proofData.encryptedFileIpfsPath
        const encryptedData = await this.ipfsMini.cat(encryptedDataIpfsPath)
        //decrypt data
        const rawData = ErasureHelper.crypto.symmetric.decryptMessage(decryptedSymkey, encryptedData)
        return rawData
    }


    /**
  * Seller retrive stake after the countdown is over
  */
    async getAgreement() {
        const countdownGriefing = await this.graph.getAgreementOfEscrow(this.address)
        return new countdownGriefing({address:countdownGriefing,wallet:this.wallet,provider:this.provider,ipfs:this.ipfs,graph:this.graph})
    }

    //====Getters====//
    async buyer() {
        return await this.contract.getBuyer();
    }

    async isBuyer(caller = null) {
        return await this.contract.isBuyer(ethers.utils.getAddress(caller || this.wallet.address));
    }

    async seller() {
        return await this.contract.getSeller();
    }

    async isSeller(caller = null) {
        return await this.contract.isSeller(ethers.utils.getAddress(caller || this.wallet.address));
    }

    /**
   * Data about this Escrow :
   * - paymentAmount, stakeAmount, ratio, ratioType, countdownLength
   */
    async data() {
        const data = await this.contract.getData();
        return data;
    }

    async status() {
        return await this.contract.getEscrowStatus();
    }
}
module.exports = { ErasureEscrow };
