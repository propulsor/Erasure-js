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
  CountdownGriefing
} = require("../../packages/Agreement");
const {RATIO_TYPES} = require("../../packages/Utils")

describe("Countdown Griefing", function() {
  const staker = stakerWallet.address,
    counterparty = counterpartyWallet.address,
    network = "ganache",
    ratio = 2,
    ratioType = RATIO_TYPES.Dec,
    metadata = "metadata",
    operator=operatorWallet.address
    let testSimple,instanceAddress,testSimpleOperator

  describe("Countdown Griefing Tests", function() {
    before(async () => {});
    it("1.Should create a CountdownGriefing agreement from class method", async () => {
      testSimple = await SimpleGriefing.create({
        staker,
        counterparty,
        ratio,
        ratioType,
        metadata,
        wallet,
        coundownLength,
        provider,
        network,
        operator
      });
      let actualCreator = await testSimple.getCreator();
      let actualOperator = await testSimple.getOperator();

      assert.equal(actualCreator, wallet.address);
      assert.equal(actualOperator, operatorWallet.address);
      //Mock NMR contract
    
    });
    it("2.Should initilize CountdownGriefing class with existed address", async () => {
      testSimple = new CountdownGriefing({ address: testSimple.address, wallet, provider });
      let actualCreator = await testSimple.getCreator();
      let actualOperator = await testSimple.getOperator();
      let actualStaker = await testSimple.getStaker()
      let actualCounterparty = await testSimple.getCounterparty()
      assert.equal(actualCreator, wallet.address,"wrong creator");
      assert.equal(actualOperator, operatorWallet.address,"wrong operator");
      assert.equal(actualStaker,staker,"wrong staker")
      assert.equal(actualCounterparty,counterparty,"wrong counterparty")
    });
    it("3.Should initilize SimpleGriefing class with existed address from operator wallet", async () => {
      testSimpleOperator = new CountdownGriefing({
        address: testSimple.address,
        wallet: operatorWallet,
        provider
      });
      let actualCreator = await testSimple.getCreator();
      let actualOperator = await testSimple.getOperator();
      let actualStaker = await testSimple.getStaker()
      let actualCounterparty = await testSimple.getCounterparty()
      assert.equal(actualCreator, wallet.address,"wrong creator");
      assert.equal(actualOperator, operatorWallet.address,"wrong operator");
      assert.equal(actualStaker,staker,"wrong staker")
      assert.equal(actualCounterparty,counterparty,"wrong counterparty")
    });

    it("4. Operator and staker should be able to approve and increase stake", async () => {
        const NMR = new ethers.Contract(Contracts.NMR.ganache.address,Contracts.NMR.artifact.abi,provider)
        NMRcontract = NMR.connect(stakerWallet)
        let tx = await NMRcontract.approve(testSimple.address,ethers.utils.parseEther("1000000000"))
        await tx.wait()
        let allowance = await NMRcontract.allowance(stakerWallet.address,testSimple.address)
        let balance = await NMRcontract.balanceOf(stakerWallet.address)
        console.log("ALLOWANCE",ethers.utils.formatEther(allowance))
        console.log("BALANCE",ethers.utils.formatEther(balance))
        let stakerSimple = new SimpleGriefing({address:testSimple.address,wallet:stakerWallet,provider})

      let hashtx = await stakerSimple.increaseStake("1");
      let stakeAddedEvent = hashtx.events.find(
        e => e.event == "StakedAdded"
      );
      assert(stakeAddedEvent.args.amountToAdd, "no amount arg found in StakedAdded event");
      assert.equal(stakeAddedEvent.args.amountToAdd, 1);

    //   let hashtxOperator = await testSimpleOperator.increaseStake(1)
    //   stakeAddedEvent = hashtxOperator.events.find(
    //     e => e.event == "StakedAdded"
    //   );
    //   assert(stakeAddedEvent.args.amountToAdd, "no amount arg found in StakedAdded event");
    //   assert.equal(stakeAddedEvent.args.amountToAdd, 1);
    });
   
  });
});
