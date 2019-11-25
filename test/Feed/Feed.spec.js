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
const { ErasureFeed } = require("../../packages/Feed/src/Feed");
const { ErasureFeed_Factory } = require("../../packages/Feed/src/Feed_Factory");

describe("Feed", function() {
  // local Post array
  let posts = [];
  const addPost = (proofHash, metadata) => {
    const postID = posts.push({ proofHash, metadata }) - 1;
    return postID;
  };

  const PROOF = "proof",
    METADATA = "metadata",
    SALT = "salt";
  // post variables
  const feedMetadata = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("feedMetadata")
  );
  const newMetaData = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("newFeedMetadata")
  );
  const proofHash = ethers.utils.sha256(hexlify(PROOF));
  let TestFeed,TestOperatorFeed,Feed_Factory,feedAddress
  describe("Feed Tests", function() {
    /**
     * Create New feed from factory as requirements
     */
    before(async () => {
      Feed_Factory = new ErasureFeed_Factory(
        wallet,
        provider,
        (network = "ganache")
      );
      [tx,feedAddress] = await Feed_Factory.create(PROOF,METADATA,operatorWallet.address)
    });
    it("1.Should create new Feed with class method", async() => {
      let feed =await  ErasureFeed.createFeed(
        PROOF,METADATA,operatorWallet.address,wallet,provider,network="ganache"
      );
      let actualCreator =await feed.getCreator()
      let actualOperator = await feed.getOperator()

      assert.equal(actualCreator,wallet.address)
      assert.equal(actualOperator,operatorWallet.address)
    });
    it("2.Should initilize ErasureFeed class with existed address",async ()=>{
      TestFeed = new ErasureFeed(feedAddress,wallet,provider)
      let actualCreator =await TestFeed.getCreator()
      let actualOperator = await TestFeed.getOperator()      
      assert.equal(actualCreator,wallet.address)
      assert.equal(actualOperator,operatorWallet.address)
    });
    it("3.Should initilize ErasureFeed class with existed address from operator wallet",async ()=>{
      TestOperatorFeed = new ErasureFeed(feedAddress,operatorWallet,provider)
      let actualCreator =await TestOperatorFeed.getCreator()
      let actualOperator = await TestOperatorFeed.getOperator()      
      assert.equal(actualCreator,wallet.address)
      assert.equal(actualOperator,operatorWallet.address)
    });

    it("4. Operator and creator should be able to submit hash for feed", async () => {
      let hashtx = await TestFeed.submitProof(PROOF);
      const proofHash = ethers.utils.keccak256(hexlify(PROOF));
      let submitProofEvent = hashtx.events.find(e=>e.event=="HashSubmitted")
      assert(submitProofEvent.args.hash,"no hash found in submitHash event")
      assert.equal(submitProofEvent.args.hash,proofHash)

    });
    it("5. Creator should be able to set Metadata", async () => {
      let resetdataTx = await TestFeed.setMetadata(newMetaData)
      const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newMetaData));
      let setDataEvent = resetdataTx.events.find(e=>e.event=="MetadataSet")
      assert(setDataEvent.args.metadata,"no metadata found in setMetaData event")
      assert.equal(setDataEvent.args.metadata,feedMetadata)
       
    });
    it("6. Operator should be able to set Metadata", async () => {
      let resetdataTx = await TestOperatorFeed.setMetadata(newMetaData)
      const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newMetaData));
      let setDataEvent = resetdataTx.events.find(e=>e.event=="MetadataSet")
      assert(setDataEvent.args.metadata,"no metadata found in setMetaData event")
      assert.equal(setDataEvent.args.metadata,feedMetadata)
    });
  });
});