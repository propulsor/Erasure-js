const { ethers } = require("ethers");
const assert = require("assert");
const { abiEncodeWithSelector, NULL_ADDRESS, hexlify } = require("../../Utils");
const { Template, Contracts } = require("../../Base");

class CountdownGriefingEscrow_Factory extends Factory {
    constructor({ wallet, provider, network = "mainnet" }) {
        super({ contract: Contracts.CountdownGriefingEscrow_Factory, wallet, provider, network })
    }
    async create(buyer, seller, paymentAmount, stakeAmount, escrowCountdown, metadata, agreementParams, operator = null, salt = null) {
        if (operator) {
            operator = getAddress(operator)
        }
        let callData = abiEncodeWithSelector("initialize",
            ["address",
                "address",
                "address",
                "uint256",
                "uint8",
                "uint256",
                "bytes"],
            [operator || NULL_ADDRESS], getAddress(buyer), getAddress(seller), getNumber(paymentAmount), getNumber(stakeAmount), getNumber(escrowCountdown), getHash(metadata), getHash(agreementParams))
        let tx
        if (salt) {
            tx = await this.contract.createSalty(callData, getBytesString(salt))
        }
        else {
            tx = await this.contract.create(callData)
        }
        let confirmedTx = await tx.wait()
        let createdEvent = confirmedTx.events.find(e => e.event == "InstanceCreated")
        try {
            assert(createdEvent.args.instance, "No new address of new instance found")
            const escrow = new CountdownGriefingEscrow({ address: createdEvent.args.instance, wallet: this.wallet, provider: this.provider })
            return { confirmedTx, escrow }
        } catch (e) {
            return { confirmedTx, error: "Escrow creation failed" }
        }

    }

}

module.exports = { CountdownGriefingEscrow_Factory }