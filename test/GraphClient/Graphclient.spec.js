const {ErasureGraph} = require("../../packages/GraphClient")
const assert = require("assert")
const {VERSION_V2,RINKEBY,MAINNET,VERSION_V1} = require("../../packages/Utils")
describe("Erasure graph test",function(){
    let client
    describe("Reading feeds from the graphs", function(){
        before(async ()=>{
            client = new ErasureGraph({network:RINKEBY,version:VERSION_V2})
        })
        it("Should get all feeds", async()=>{
            const feeds = await client.feeds()
            console.log("feeds", feeds.length)
            assert(feeds,"no feeds found")
        })
    })
})