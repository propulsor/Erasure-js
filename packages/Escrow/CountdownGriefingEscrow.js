/**
 * Wrapper for CountdownGriefingEscrow factory and template
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, AGREEMENT_STATUS, hexlify } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow_Factory extends Factory{
    constructor(){}
    async create(buyer,seller,paymentAmount,stakeAmount,escrowCountdown,metadata,agreementParams,operator=null){
        
    }
    async createSalty(){}
}
class CountdownGriefingEscrow extends Template{
   constructor(escrowAddress,wallet,provider){}
    async depositStake(){

    }
    async depositPayment(){}
    async finalize(){}
    async submitData(data){}
    async cancel(){}
    async timeout(){}

    //GETTERS
    async getBuyer(){}
    async isBuyer(){}
    async getSeller(){}
    async getData(){}
    async getEscrowStatus(){}



}
module.exports={CountdownGriefingEscrow}