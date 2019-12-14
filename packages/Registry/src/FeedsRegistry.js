const { Registry, Contracts } = require("../../Base");

class Feeds_Registry extends Registry {
  constructor(provider, network = "mainnet") {
    super(Contracts.Erasure_Feeds, provider, network);
  }
 async getFeed(address){return this.getInstance(address)}
 async getFeedsCount (){return this.getInstanceCount()}
 async getFeedData(address){return this.getInstanceData(address)}
 async getAllFeeds(){return this.getInstances()}
 async getPaginatedFeeds(start,end){return this.getPaginatedInstances(start,end)}
}
module.exports = Feeds_Registry 
