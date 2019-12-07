const { Registry, Contracts } = require("../../Base");

class Agreements_Registry extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Agreements, provider, network);
  }
  getAgreement=this.getInstance
  getAgreementsCount = this.getInstanceCount
  getAgreementData=this.getInstanceData
  getAllAgreements=this.getInstances
  getPaginatedAgreements=this.getPaginatedInstances
}
module.exports =  Agreements_Registry 