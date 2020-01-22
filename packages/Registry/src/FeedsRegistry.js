const { Registry } = require("../../Base");

class Feeds_Registry extends Registry {
    constructor(opts) {
        super({contractName:"Erasure_Posts",...opts});
    }

    async getFeed(address){return this.getInstance(address)}

    async getFeedsCount (){return this.getInstanceCount()}

    async getFeedData(address){return this.getInstanceData(address)}

    async getAllFeeds(){return this.getInstances()}

    async getPaginatedFeeds(start,end){return this.getPaginatedInstances(start,end)}
}
module.exports = Feeds_Registry
