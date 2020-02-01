const assert = require("assert");
const { ethers } = require("ethers");
const {
    hexlify,
    abiEncodeWithSelector,
    NULL_ADDRESS,
    wallet,
    operatorWallet,
    stakerWallet,
    provider
} = require("../utils");
const { Contracts } = require("../../packages/Base");
const { Feed_Factory } = require("../../packages/Feed");
const {NETWORKS,VERSIONS} = require("../../packages/Constants")
const ErasureHelper=require("@erasure/crypto-ipfs")

describe("Feed Factory", function() {
    const PROOF = "proof",
        METADATA = "metaData",
        NEWDATA = "newMetadata",
        SALT = "salt",
        network=NETWORKS.ganache,
        version=VERSIONS.V3
    const proofHash = ethers.utils.sha256(hexlify(PROOF));
    let feedMetadata
    beforeEach(async ()=>{
        feedMetadata = await ErasureHelper.multihash({
            input: METADATA,
            inputType: 'raw',
            outputType: 'hex',
          })
          newFeedMetadata = await ErasureHelper.multihash({
            input: NEWDATA,
            inputType: 'raw',
            outputType: 'hex',
          })
    })
   
    let feedFactory;
    describe.only("Feed Factory", function() {
        it("1.Should Initialize Feed Factory class with wallet", done => {
            feedFactory = new Feed_Factory({ wallet, provider, network,version,contracts });
            done();
        });
        // it("2. Should create new feed WITHOUT salt, WITHOUT operator", async () => {
        //     let {confirmedTx, feed} = await feedFactory.create({
        //         metaData: METADATA,ipfs,graph
        //     });
        //     let callData = abiEncodeWithSelector(
        //         "initialize",
        //         ["address", "bytes"],
        //         [NULL_ADDRESS, feedMetadata]
        //     );
        //     let newFeedEvent = confirmedTx.events.find(
        //         e => e.event == "InstanceCreated",
        //         "No InstanceCreated event found"
        //     );
        //     assert.equal(newFeedEvent.args.callData, callData);
           
        //     let actualOperator = await feed.operator();
        //     assert.equal(actualOperator, NULL_ADDRESS);
        // });
        it("3. Should create new feed WITHOUT salt, WITH operator", async () => {
            feedFactory = new Feed_Factory({ wallet:stakerWallet, provider, network,version,contracts });

            const operatorAddress = await operatorWallet.getAddress()
            console.log("Operator address", operatorAddress)
            let {confirmedTx, feed} = await feedFactory.create({
                metaData: NEWDATA,
                operator: operatorAddress,
                ipfs,graph
            });
            let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes"],
                [
                    operatorAddress,
                    newFeedMetadata
                ]
            );
            let newFeedEvent = confirmedTx.events.find(
                e => e.event == "InstanceCreated",
                "No InstanceCreated event found"
            );
            assert.equal(newFeedEvent.args.callData, callData);
            // let actualOperator = await feed.operator();
            // assert.equal(actualOperator, operatorAddress, "wrong operator");
        });
       
    });
});
