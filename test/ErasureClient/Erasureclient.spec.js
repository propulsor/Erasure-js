const etherlime = require("etherlime-lib");
const { deploy } = require("../deploy_ganache");
const { ethers } = require("ethers");
const ganache = require("ganache-core");
const assert = require("assert");
const {Contracts} = require("../../packages/Base")
const {
  hexlify,
  NULL_ADDRESS,
  wallet,
  operatorWallet,
  provider,
  stakerWallet,
  counterpartyWallet
} = require("../utils");
const {
  ErasureClient
} = require("../../packages/ErasureClient");
const {RATIO_TYPES,AGREEMENT_TYPE} = require("../../packages/Utils")

describe.only("ErasureClient", function() {
  const staker = stakerWallet.address,
    counterparty = counterpartyWallet.address,
    network = "ganache",
    ratio = 2,
    ratioType = RATIO_TYPES.Dec,
    metaData = "metadata",
    operator=operatorWallet.address
    countdown =10
    let client, ipfs,graph

  describe.only("Erasure Client test", function() {
    before(async () => {
    });
    it("1.Should create a Erasure Client", async () => {
       client = new ErasureClient({wallet,provider,network,ipfs,graph})
      const usersCount = await client.getUsersAcount()
      console.log(usersAcount)
      assert(usersCount,"No users count found")
    
    });
    it("2.Should get registry infomation", async () => {
      
    });
    it("3.Should create and get Feed", async () => {
     
    });

    it("4. Should create and get Agreement", async () => {
      
    });
    it("5 . Should create and get escrow",async ()=>{

    });
   
  });
});
