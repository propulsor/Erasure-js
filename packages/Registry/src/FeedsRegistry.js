const { Registry, Contracts } = require("../../Base");

class Feeds_Registry extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Feeds, provider, network);
  }
  getFeed=this.getInstance
  getFeedsCount = this.getInstanceCount
  getFeedData=this.getInstanceData
  getAllFeeds=this.getInstances
  getPaginatedFeeds=this.getPaginatedInstances
}
module.exports = Feeds_Registry 
