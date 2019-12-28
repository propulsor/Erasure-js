const assert = require("assert");
const {
    wallet,
    provider,
    stakerWallet,
    counterpartyWallet,
    operatorWallet
} = require("../utils");
const {RATIO_TYPES} = require("../../packages/Utils")
const {ErasureEscrow,Escrow_Factory} = require("../../packages/Escrow")

describe("CountdownGriefingEscrow",function(){
    let testEscrow,escrowOpts,ipfs,graph
    const network = "ganache",
        ratio = 2,
        ratioType = RATIO_TYPES.Dec,
        metaData = "metaData"
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

