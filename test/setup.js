const { deploy } = require("./deploy_ganache");
const { Contracts } = require("../packages/Base");
const {ethers} = require("ethers")
const assert = require("assert")
const {stakerWallet,counterpartyWallet,network,provider,wallet} = require("./utils")
const delay = (ms) => new Promise(_ => setTimeout(_, ms));
const IPFS = require("ipfs-mini")
const ErasureGraph = require("../packages/GraphClient")
const ErasureHelper = require("@erasure/crypto-ipfs")

before(async () => {
  const [deployer,contracts] = await deploy("ganache", Contracts);
  //Mint NMR tokens to staker, creator, operator and counterparty
  await delay(2000)
  console.log("NMR address ", contracts.NMR.ganache.address)
  const NMRcontract = new ethers.Contract(contracts.NMR.ganache.address,contracts.NMR.artifact.abi,provider)
//   NMRcontract.connect(deployer.signer)
//   const balance = ethers.utils.parseEther("1000")
//   let tx = await NMRcontract.mintMockTokens(stakerWallet.address,balance)
//   await tx.wait()
  const actualBalance = await NMRcontract.balanceOf(stakerWallet.address)
  assert.equal(ethers.utils.formatEther(actualBalance),"1000.0")
//   NMRcontract.from(counterpartyWallet.address).mintMockTokens(counterpartyWallet.address,balance)
    ipfs = new IPFS({host:"ipfs.infura.io",port:"5001",protocol:"https"})
      graph = new ErasureGraph({network:"rinkery",uri:"https://api.thegraph.com/subgraphs/name/jgeary/erasure-rinkeby120"})
});


