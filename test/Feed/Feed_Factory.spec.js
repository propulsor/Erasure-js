const etherlime = require("etherlime-lib");
const { deploy } = require("../deploy_ganache");
const { ethers } = require("ethers");
const ganache = require("ganache-core");
const { hexlify } = require("../utils");
const { Contracts } = require("../../packages/Base");
const { ErasureFeed_Factory } = require("../../packages/Feed/src/Feed_Factory");

const web3 = require("web3");
const delay = ms => new Promise(_ => setTimeout(_, ms));

describe("Feed Factory", function() {
  // local Post array
  let posts = [];
  const addPost = (proofHash, metadata) => {
    const postID = posts.push({ proofHash, metadata }) - 1;
    return postID;
  };
  let provider = new ethers.providers.JsonRpcProvider();
  // const ganache = require("ganache-core");

  // provider.getNetwork().then(n=>{console.log("network NAME",n)})
  // provider.resolveName("ganache").then(res=>{console.log("resolve NAME",res)})
  // provider.network.name = "ganache"
  let wallet = new ethers.Wallet(
    "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
    provider
  );
  // post variables
  const feedMetadata = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("feedMetadata")
  );
  const newFeedMetadata = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("newFeedMetadata")
  );
  const proofHash = ethers.utils.sha256(hexlify("proofHash"));
  let TestFeed;
  describe("Feed Factory", function() {
    it("2.Should Initialize Feed Factory class with wallet", done => {
      console.log(
        "done deploying in Feed Factory ",
        Contracts.Feed.factory.ganache.address
      );
      TestFeed = new ErasureFeed_Factory(
        wallet,
        (network = "ganache"),
        provider,
        Contracts
      );
      
      done();
    });
    it("3. Should create new feed WITHOUT salt", async () => {
      let newFeed = await TestFeed.createFeed("proof", "metaData");
      console.log("new feed", newFeed);
    });
    it("4. Should create new feed WITH salt", async () => {});
    it("5. Creator should be able to set Metadata", async () => {});
    it("6. Operator and creator should be able to submit hash for feed", async () => {});
    it("7. Should get all current feeds from registries", async () => {});
  });
});
