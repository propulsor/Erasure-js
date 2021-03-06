/**
 * Factory to create new CoundownGriefing Agreements
 */
const { ethers } = require("ethers");
const assert = require("assert");
const { NULL_ADDRESS, abiEncodeWithSelector, hexlify, AGREEMENT_TYPE } = require("../Utils");
const { Factory, Contracts } = require("../Base");
const {ErasureAgreement} = require("./Agreement")

class Agreement_Factory extends Factory {
    constructor({ wallet, provider, network = "mainnet",type }) {
        if (!type || type == AGREEMENT_TYPE.COUNTDOWN) {
            super({ contract: Contracts.CountdownGriefing, wallet, network, provider });
        } else {
            super({ contract: Contracts.SimpleGriefing, wallet, network, provider });

        }
    }

    async create({
        staker,
        counterparty,
        ratio,
        ratioType,
        countdown=null,
        metaData,
        ipfs,
        graph,
        operator = null,
        salt = null }
    ) {
        if (operator) {
            operator = ethers.utils.getAddress(operator);
        }
        let callData
        if(!countdown){//simplegriefing
            callData = abiEncodeWithSelector(
                "initialize",
                ["address", "address", "address", "uint256", "uint8", "bytes"],
                [
                    operator || NULL_ADDRESS,
                    ethers.utils.getAddress(staker),
                    ethers.utils.getAddress(counterparty),
                    ethers.utils.bigNumberify(ratio),
                    ethers.utils.bigNumberify(ratioType),
                    ethers.utils.keccak256(hexlify(metaData))
                ]
            );
        }
        else{//countdownGriefing
            callData = abiEncodeWithSelector(
                "initialize",
                ["address", "address", "address", "uint256", "uint8", "uint256", "bytes"],
                [
                    operator || NULL_ADDRESS,
                    ethers.utils.getAddress(staker),
                    ethers.utils.getAddress(counterparty),
                    ethers.utils.bigNumberify(ratio),
                    ethers.utils.bigNumberify(ratioType),
                    ethers.utils.bigNumberify(countdown),
                    ethers.utils.keccak256(hexlify(metaData))
                ]
            );
        }
        let tx;
        if (salt) {
            tx = await this.contract.createSalty(
                callData,
                ethers.utils.formatBytes32String(salt)
            );
        } else {
            tx = await this.contract.create(callData);
        }
        let confirmedTx = await tx.wait();
        let createdEvent = confirmedTx.events.find(
            e => e.event == "InstanceCreated"
        );
        assert(createdEvent.args.instance, "No new instance's address found");
        const agreement = new ErasureAgreement({ address: createdEvent.args.instance, wallet: this.wallet, provider: this.provider, ipfs, graph })
        return { confirmedTx, agreement };
    }
}

module.exports = { Agreement_Factory };
