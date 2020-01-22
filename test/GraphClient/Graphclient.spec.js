const {ErasureGraph} = require("../../packages/GraphClient")
const assert = require("assert")
const {VERSIONS,NETWORKS} = require("../../packages/Constants")
describe("Erasure graph test",function(){
    let client
    describe("Reading feeds from the graphs", function(){
        before(async ()=>{
            client = new ErasureGraph({network:NETWORKS.RINKEBY,version:VERSIONS.V2})
        })
        it("Should get all feeds", async()=>{
            const feeds = await client.feeds()
            console.log("feeds", feeds.length)
            assert(feeds,"no feeds found")
        })
    })
})