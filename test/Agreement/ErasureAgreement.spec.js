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
  Agreement_Factory,ErasureAgreement
} = require("../../packages/Agreement");
const {RATIO_TYPES,AGREEMENT_TYPE} = require("../../packages/Utils")

describe("Agreements", function() {
  const staker = stakerWallet.address,
    counterparty = counterpartyWallet.address,
    network = "ganache",
    ratio = 2,
    ratioType = RATIO_TYPES.Dec,
    metaData = "metadata",
    operator=operatorWallet.address
    countdown =10
    let testAgreement,agreementFactory, ipfs,graph

  describe("Agreements Factory  and agreement", function() {
    before(async () => {
    });
    it("1.Should create a CountdownGriefing Agreement from Factory", async () => {
       agreementFactory = new Agreement_Factory({wallet,provider,network})
      const {confirmedTx,agreement} = await agreementFactory.create({
        staker,
        counterparty,
        ratio,
        ratioType,
        metaData,
        wallet,
        countdown,
        provider,
        network,
        operator,ipfs,graph
      });
      testAgreement = agreement
      let actualCreator = await agreement.owner();
      let actualOperator = await agreement.operator();

      assert.equal(actualCreator, wallet.address);
      assert.equal(actualOperator, operatorWallet.address);
      //Mock NMR contract
    
    });
    it("2.Should initilize Agreement class with existed address", async () => {
      testAgreement = new ErasureAgreement({ address: testAgreement.address, wallet, provider });
      let actualCreator = await testAgreement.owner();
      let actualOperator = await testAgreement.operator();
      let actualStaker = await testAgreement.staker()
      let actualCounterparty = await testAgreement.counterparty()
      assert.equal(actualCreator, wallet.address,"wrong creator");
      assert.equal(actualOperator, operatorWallet.address,"wrong operator");
      assert.equal(actualStaker,staker,"wrong staker")
      assert.equal(actualCounterparty,counterparty,"wrong counterparty")
    });
    it("3.Should initilize SimpleGriefing class with existed address from operator wallet", async () => {
      testSimpleOperator = new ErasureAgreement({
        address: testAgreement.address,
        wallet: operatorWallet,
        provider
      });
      let actualCreator = await testAgreement.owner();
      let actualOperator = await testAgreement.operator();
      let actualStaker = await testAgreement.staker()
      let actualCounterparty = await testAgreement.counterparty()
      assert.equal(actualCreator, wallet.address,"wrong creator");
      assert.equal(actualOperator, operatorWallet.address,"wrong operator");
      assert.equal(actualStaker,staker,"wrong staker")
      assert.equal(actualCounterparty,counterparty,"wrong counterparty")
    });

    it.skip("4. Operator and staker should be able to approve and increase stake", async () => {
        const NMR = new ethers.Contract(Contracts.NMR.ganache.address,Contracts.NMR.artifact.abi,provider)
        NMRcontract = NMR.connect(stakerWallet)
        let tx = await NMRcontract.approve(testAgreement.address,ethers.utils.parseEther("1000000000"))
        await tx.wait()
        let allowance = await NMRcontract.allowance(stakerWallet.address,testAgreement.address)
        let balance = await NMRcontract.balanceOf(stakerWallet.address)
        console.log("ALLOWANCE",ethers.utils.formatEther(allowance))
        console.log("BALANCE",ethers.utils.formatEther(balance))
        let stakerFactory = new Agreement_Factory({wallet:stakerWallet,provider,network,type:AGREEMENT_TYPE.COUNTDOWN})
        let {confirmedTx,agreement} = await stakerFactory.create({ staker:stakerWallet.address,
          counterparty,
          ratio,
          ratioType,
          metaData,
          countdown,
          operator,ipfs,graph})
      let hashtx = await agreement.increaseStake("1");
      let stakeAddedEvent = hashtx.events.find(
        e => e.event == "StakedAdded"
      );
      assert(stakeAddedEvent.args.amountToAdd, "no amount arg found in StakedAdded event");
      assert.equal(stakeAddedEvent.args.amountToAdd, 1);
        //FIX ME : got revert error
    //   let hashtxOperator = await testSimpleOperator.increaseStake(1)
    //   stakeAddedEvent = hashtxOperator.events.find(
    //     e => e.event == "StakedAdded"
    //   );
    //   assert(stakeAddedEvent.args.amountToAdd, "no amount arg found in StakedAdded event");
    //   assert.equal(stakeAddedEvent.args.amountToAdd, 1);
    });
   
  });
});
