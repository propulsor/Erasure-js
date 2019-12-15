const { Registry, Contracts } = require("../../Base");

class Agreements_Registry extends Registry {
  constructor({provider, network = "mainnet"}) {
    super({contract:Contracts.Erasure_Agreements, provider, network});
  }
  async getAgreement(address){return this.getInstance(address)}
  async getAgreementsCount(){return this.getInstanceCount()}
  async getAgreementData(address){return this.getInstanceData(address)}
  async getAllAgreements(){return this.getInstances()}
  async getPaginatedAgreements(start,end){return this.getPaginatedInstances(start,end)}
}
module.exports =  Agreements_Registry 