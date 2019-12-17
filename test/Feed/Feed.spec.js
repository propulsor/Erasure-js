const etherlime = require("etherlime-lib");
const { deploy } = require("../deploy_ganache");
const { ethers } = require("ethers");
const ganache = require("ganache-core");
const assert = require("assert")
const {
    hexlify,
    NULL_ADDRESS,
    wallet,
    operatorWallet,
    provider
} = require("../utils");
const { Contracts } = require("../../packages/Base");
const { ErasureFeed,Feed_Factory } = require("../../packages/Feed");
const IPFS = require("ipfs-mini")
const ErasureGraph = require("../../packages/GraphClient")
const ErasureHelper = require("@erasure/crypto-ipfs")


describe("Feed", function() {
    // local Post array
    let posts = [];
    const addPost = (proofHash, metaData) => {
        const postID = posts.push({ proofHash, metaData }) - 1;
        return postID;
    };

    const PROOF = "proof",
        METADATA = "metaData",
        SALT = "salt";
    // post variables
    const feedMetadata = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("feedMetadata")
    );
    const newMetaData = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("newFeedMetadata")
    );
    const proofHash = ethers.utils.sha256(hexlify(PROOF));
    let TestOperatorFeed,feedFactory, TestFeed, ifpfs,graph
    describe("Feed Tests", function() {
    /**
     * Create New feed from factory as requirements
     */
        before(async () => {
            feedFactory = new Feed_Factory({
                wallet,
                provider,
                network : "ganache"}
            );
            const {confirmedTx,feed} = await feedFactory.create({proof:PROOF,metaData:METADATA,operator:operatorWallet.address})
            TestFeed = feed
            tx = confirmedTx
            ipfs = new IPFS({host:"ipfs.infura.io",port:"5001",protocol:"https"})
            graph = new ErasureGraph({network:"rinkerby",uri:"https://api.thegraph.com/subgraphs/name/jgeary/erasure-rinkeby120"})
        });
        it("2.Should initilize ErasureFeed class with existed address",async ()=>{
            TestFeed = new ErasureFeed({address:TestFeed.address,wallet,provider,ipfs,graph})
            let actualCreator =await TestFeed.owner()
            let actualOperator = await TestFeed.operator()
            assert.equal(actualCreator,wallet.address)
            assert.equal(actualOperator,operatorWallet.address)
        });
        it("3.Should initilize ErasureFeed class with existed address from operator wallet",async ()=>{
            TestOperatorFeed = new ErasureFeed({address:TestFeed.address,wallet:operatorWallet,provider,ipfs,graph})
            let actualCreator =await TestOperatorFeed.owner()
            let actualOperator = await TestOperatorFeed.operator()
            assert.equal(actualCreator,wallet.address)
            assert.equal(actualOperator,operatorWallet.address)
        });

        it("4. Operator and creator should be able to create post for feed", async () => {
            let {symKey,confirmedTx} = await TestFeed.createPost(PROOF);
            let submitProofEvent = confirmedTx.events.find(e=>e.event=="HashSubmitted")
            assert(submitProofEvent.args.hash,"no hash found in submitHash event")
            assert(symKey,"No symkey found")

        });
        it("5. Creator should be able to set Metadata", async () => {
            let resetdataTx = await TestFeed.setMetadata(newMetaData)
            const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newMetaData));
            let setDataEvent = resetdataTx.events.find(e=>e.event=="MetadataSet")
            assert(setDataEvent.args.metaData,"no metaData found in setMetaData event")
            assert.equal(setDataEvent.args.metaData,feedMetadata)

        });
        it("6. Operator should be able to set Metadata", async () => {
            let resetdataTx = await TestOperatorFeed.setMetadata(newMetaData)
            const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newMetaData));
            let setDataEvent = resetdataTx.events.find(e=>e.event=="MetadataSet")
            assert(setDataEvent.args.metaData,"no metaData found in setMetaData event")
            assert.equal(setDataEvent.args.metaData,feedMetadata)
        });
    });
});
