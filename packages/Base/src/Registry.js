/**
 * Registry parent class for all the registries
 */

const { ethers } = require("ethers");
/**
 * Read only class for getting data from registries
 */
class Registry {
    constructor({contract, provider, network = "mainnet"}) {
        this.provider = provider;
        this.contract = new ethers.Contract(
            contract[network].address,
            contract.artifact.abi,
            provider
        );
        this.network=network
    }

    //GETTERS
    async getInstanceType() {
        return await this.contract.getInstanceType();
    }

    async getInstanceCount() {
        const count =  await this.contract.getInstanceCount();
        return count.toString()
    }

    async getInstance(index) {
        return await this.contract.getInstance(ethers.utils.bigNumberify(index));
    }

    async getInstanceData(index) {
        return await this.contract.getInstanceData(
            ethers.utils.bigNumberify(index)
        );
    }

    async getInstances() {
        return await this.contract.getInstances();
    }

    async getPaginatedInstances(start, end) {
        return await this.contract.getPaginatedInstances(
            ethers.utils.bigNumberify(start),
            ethers.utils.bigNumberify(end)
        );
    }

    async getFactoryId(address){
        return await this.contract.getFactoryID(address)
    }
}
module.exports = { Registry };
