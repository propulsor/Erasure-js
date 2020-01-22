const { deploy } = require("./deploy_ganache");
const {ethers} = require("ethers")
const assert = require("assert")
const {stakerWallet,counterpartyWallet,network,provider,wallet} = require("./utils")
const delay = (ms) => new Promise(_ => setTimeout(_, ms));
const IPFS = require("ipfs-mini")
const {ErasureGraph} = require("../packages/GraphClient")
const ErasureHelper = require("@erasure/crypto-ipfs")
const {ErasureV3} = require("@erasure/abis")

before(async () => {
    const [deployer,contracts] = await deploy("ganache", ErasureV3);
    //Mint NMR tokens to staker, creator, operator and counterparty
    await delay(2000)
    const NMRC = new ethers.Contract(contracts.NMR.ganache.address,contracts.NMR.artifact.abi,provider)
    let NMRcontract = NMRC.connect(counterpartyWallet)
    const balance = ethers.utils.parseEther("1000")
    let tx = await NMRcontract.mintMockTokens(counterpartyWallet.address,balance)
    await tx.wait()
    NMRcontract = NMRC.connect(stakerWallet)
    tx = await NMRcontract.mintMockTokens(stakerWallet.address,balance)
    await tx.wait()
    ipfs = new IPFS({host:"ipfs.infura.io",port:"5001",protocol:"https"})
    graph = new ErasureGraph({network:"rinkery",uri:"https://api.thegraph.com/subgraphs/name/jgeary/erasure-rinkeby120"})
});


