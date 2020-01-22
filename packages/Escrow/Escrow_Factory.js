const { ethers } = require("ethers");
const assert = require("assert");
const { abiEncodeWithSelector } = require("../Utils");
const {NULL_ADDRESS} = require("../Constants")
const {ErasureEscrow} = require("./ErasureEscrow")
const { Factory } = require("../Base");
const getAddress = ethers.utils.getAddress
const getNumber = ethers.utils.bigNumberify
const getHash = ethers.utils.hexlify
const AbiCoder = new ethers.utils.AbiCoder()


class Escrow_Factory extends Factory {
    constructor(opts) {
        super({ contractName: "CountdownGriefingEscrowFactory", ...opts })
    }

    /**
     *
     * @param {Object} param0
     */
    async create({ buyer, seller, paymentAmount, stakeAmount, countdown, metaData, agreementParams, ipfs, graph, operator = null, salt = null }) {
        if (operator) {
            operator = getAddress(operator)
        }
        const agreementTypes = ['uint120', 'uint8', 'uint128']
        // const agreementParams = [griefRatio, ratioType, agreementCountdown]
        const encodedParams = AbiCoder.encode(agreementTypes, [agreementParams.ratio,agreementParams.ratioType,agreementParams.agreementCountdown])

        let callData = abiEncodeWithSelector("initialize",
            ["address",
                "address",
                "address",
                "uint256",
                "uint256",
                "uint256",
                "bytes",
                "bytes"],
            [operator || NULL_ADDRESS,
                getAddress(buyer||NULL_ADDRESS),
                getAddress(seller|| NULL_ADDRESS),
                getNumber(paymentAmount),
                getNumber(stakeAmount),
                getNumber(countdown),
                ethers.utils.toUtf8Bytes(metaData||""),
                getHash(encodedParams)])
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
            console.log("Address", createdEvent.args.instance)
            const escrow = new ErasureEscrow({ address: createdEvent.args.instance, wallet: this.wallet, provider: this.provider,ipfs,graph })
            return { confirmedTx, escrow }
        } catch (e) {
            console.log("error creating escrow",e)
            return { confirmedTx, error: "Escrow creation failed" }
        }

    }

}

module.exports = { Escrow_Factory }