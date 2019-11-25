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

module.exports={CountdownGriefingEscrow_Factory}