const { Registry, Contracts } = require("../../Base");

class Escrows_Registry extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Escrows, provider, network);
  }
  getEscrow=this.getInstance
  getEscrowsCount = this.getInstanceCount
  getEscrowData=this.getInstanceData
  getAllEscrows=this.getInstances
  getPaginatedEscrows=this.getPaginatedInstances
}
module.exports = Escrows_Registry 