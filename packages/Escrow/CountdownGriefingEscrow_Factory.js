const { ethers } = require("ethers");
const assert = require("assert");
const { abiEncodeWithSelector,NULL_ADDRESS, hexlify } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow_Factory extends Factory{
    constructor(wallet,provider,instanceAddress=null,network="mainnet"){
        super(Contracts.CountdownGriefingEscrow_Factory,wallet,provider,instanceAddress,network)
    }
    async create(buyer,seller,paymentAmount,stakeAmount,escrowCountdown,metadata,agreementParams,operator=null,salt=null){
        if(operator){
            operator=getAddress(operator)
        }
        let callData = abiEncodeWithSelector("initialize",
        ["address",
        "address",
        "address",
        "uint256",
        "uint8",
        "uint256",
        "bytes"],
        [operator||NULL_ADDRESS],getAddress(buyer),getAddress(seller),getNumber(paymentAmount),getNumber(stakeAmount),getNumber(escrowCountdown),getHash(metadata),getHash(agreementParams))
        let tx
        if(salt){
            tx = await this.contract.createSalty(callData,getBytesString(salt))
        }
        else{
         tx = await this.contract.create(callData)
        }
        let confirmedTx = await tx.wait()
        let createdEvent = confirmedTx.events.find(e=>e.event=="InstanceCreated")
        assert(createdEvent.args.instance,"No new address of new instance found")
        return [confirmedTx,createdEvent.args.instance]
    }

}

module.exports={CountdownGriefingEscrow_Factory}