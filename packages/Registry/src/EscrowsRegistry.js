const { Registry } = require("../../Base");


class Escrows_Registry extends Registry {
    constructor(opts) {
        super({contractName:"Erasure_Escrows",...opts});
    }

    async getEscrow(address){return this.getInstance(address)}

    async getEscrowsCount(){return this.getInstanceCount()}

    async getEscrowData(address){return this.getInstanceData(address)}

    async getAllEscrows(){return this.getInstances()}

    async getPaginatedEscrows(start,end){return this.getPaginatedInstances(start,end)}
}
module.exports = Escrows_Registry