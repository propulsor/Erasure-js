const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, AGREEMENT_STATUS, hexlify } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow_Factory extends Factory{
    constructor(wallet,provider,network="mainnet"){
        super(Contracts.CountdownGriefingEscrow_Factory,wallet,provider,network)
    }
    async create(buyer,seller,paymentAmount,stakeAmount,escrowCountdown,metadata,agreementParams,operator=null){
        
    }
    async createSalty(buyer,seller,paymentAmount,stakeAmount,escrowCountdown,metadata,agreementParams,salt,operator=null){
        
    }
}

module.exports={CountdownGriefingEscrow_Factory}