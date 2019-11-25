const { Registry, Contracts } = require("../../Base");

class Erasure_Agreements extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Agreements, provider, network);
  }
  getAgreement=this.getInstance
  getAgreementsCount = this.getInstanceCount
  getAgreementData=this.getInstanceData
  getAllAgreements=this.getInstances
  getPaginatedAgreements=this.getPaginatedInstances
}
module.exports = { Erasure_Agreements };