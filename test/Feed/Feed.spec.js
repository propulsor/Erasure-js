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
  const newFeedMetadata = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("newFeedMetadata")
  );
  const proofHash = ethers.utils.sha256(hexlify(PROOF));
  let TestFeed,Feed_Factory,feedAddress
  describe("Feed Tests", function() {
    /**
     * Create New feed from factory as requirements
     */
    before(async () => {
      Feed_Factory = new ErasureFeed_Factory(
        wallet,
        (network = "ganache"),
        provider
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
    it("3. Operator and creator should be able to submit hash for feed", async () => {
      let hashtx = await TestFeed.submitProof(PROOF);
      console.log("submit proof", hashtx);
      
    });
    it("4. Operator should be able to set Metadata", async () => {

    });
    it("5. Creator should be able to set Metadata", async () => {});

    it("7. Should get all current posts for this feeds from registries", async () => {});
  });
});
