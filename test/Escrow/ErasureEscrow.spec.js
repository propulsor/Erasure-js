const assert = require("assert");
const { ethers } = require("ethers");
const {
    hexlify,
    abiEncodeWithSelector,
    NULL_ADDRESS,
    wallet,
    provider,
    stakerWallet,
    counterpartyWallet,
    operatorWallet
} = require("../utils");
const { Contracts } = require("../../packages/Base");
const {RATIO_TYPES,AGREEMENT_TYPE} = require("../../packages/Utils")
const {ErasureEscrow,Escrow_Factory} = require("../../packages/Escrow")

describe("CountdownGriefingEscrow",function(){
    let testEscrow,escrowOpts,ipfs,graph
    const staker = stakerWallet.address,
        counterparty = counterpartyWallet.address,
        network = "ganache",
        ratio = 2,
        ratioType = RATIO_TYPES.Dec,
        metaData = "metaData",
        operator=operatorWallet.address,
        countdown =10,
        proof="proof"
    describe("Escrow factory",function(){
        before(()=>{
            escrowOpts ={
                paymentAmount:1,
                stakeAmount:1,
                countdown:1,
                agreementParams:{
                    ratio,
                    ratioType,
                    agreementCountdown:20
                },
                buyer:wallet.address,
                metaData
            }
        });
        it("Should create CountfownGriefingEscrow ",async ()=>{
            const factory = new Escrow_Factory({wallet,provider,network})
            const{confirmedTx,escrow} = await factory.create(escrowOpts)
            assert(escrow.address,"No escrow created")
            assert.equal(await escrow.owner(),wallet.address)
            testEscrow  =escrow
        });

        it("Init escrow from existed address",function(){
            const sameEscrow = new ErasureEscrow({address:testEscrow.address,wallet,provider,ipfs,graph})
            assert.equal(sameEscrow.address,testEscrow.address)
        })
        it("Should deposit stake",async ()=>{
            sellerEscrow = new ErasureEscrow({address:testEscrow.address,wallet:counterpartyWallet,provider})
            const confirmedTx = await sellerEscrow.depositStake(1)
            console.log("confirmed tx of deposit stake", confirmedTx)


        })
        it("Should deposit payment", async ()=>{

        })
        it("Should finalize", async()=>{

        })
        it("Should submit data", async()=>{

        })
        it("should deliver key", async ()=>{

        })
        it("Should retrieve data from seller", async ()=>{

        })
        it("Should get agreement", async ()=>{

        })
        it("Should release stake", async ()=>{

        })
    })

})

