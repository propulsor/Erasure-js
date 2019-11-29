const { Registry, Contracts } = require("../../Base");

class Erasure_Escrows extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Escrows, provider, network);
  }
  getEscrow=this.getInstance
  getEscrowsCount = this.getInstanceCount
  getEscrowData=this.getInstanceData
  getAllEscrows=this.getInstances
  getPaginatedEscrows=this.getPaginatedInstances
}
module.exports = Erasure_Escrows 