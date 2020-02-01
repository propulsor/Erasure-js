const { Registry } = require("../../Base");

class Agreements_Registry extends Registry {
    constructor(opts) {
        super({contractName:"Erasure_Agreements",...opts});
    }

    async getAgreement(address){return this.getInstance(address)}

    async getAgreementsCount(){return this.getInstanceCount()}

    async getAgreementData(address){
        const allAgreements = await  this.getAllAgreements()
        for(let i in allAgreements){
            if(address==allAgreements[i]){
                const data =  await this.getInstanceData(i)
                return data
            }
        }
        return null
    }



    async getAllAgreements(){return this.getInstances()}

    async getPaginatedAgreements(start,end){return this.getPaginatedInstances(start,end)}

    async getCountDownFactoryId(){
        console.log("THIS NETWORK",this.network)
        return await this.getFactoryId(Contracts.CountdownGriefing.factory[this.network].address)
    }
}
module.exports =  Agreements_Registry