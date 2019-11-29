const etherlime = require("etherlime-lib");
const ethers = require("ethers");
const {
  hexlify,
  createIPFShash,
  stakerWallet,
  counterpartyWallet
} = require("./utils");
const assert = require("assert");

require("dotenv").config();

const deploy = async (network, c) => {

  let deployer;
  let multisig;

  let defaultGas = ethers.utils.parseUnits("15", "gwei");
  let gasUsed = ethers.constants.Zero;

  console.log(``);
  console.log(`Initialize Deployer`);
  console.log(``);


  // initialize deployer
  
  deployer = await new etherlime.EtherlimeGanacheDeployer()

  console.log(`Deployment Wallet: ${deployer.signer.address}`);

  // Erasure_Escrows
  await deployRegistry("Erasure_Escrows");
  await deployRegistry("Erasure_Agreements");
  await deployRegistry("Erasure_Posts");

  await deployNMR()

  // Erasure_Posts
  await getRegistry("Erasure_Posts");

  // Erasure_Agreements
  await getRegistry("Erasure_Agreements");

  // Erasure_Escrows
  await getRegistry("Erasure_Escrows");


  // Feed
  await deployFactory("Feed", "Erasure_Posts");

  // SimpleGriefing
  await deployFactory("SimpleGriefing", "Erasure_Agreements");

  // CountdownGriefing
  await deployFactory("CountdownGriefing", "Erasure_Agreements");

  // CountdownGriefingEscrow
  const abiEncoder = new ethers.utils.AbiCoder();
  const agreementFactory = abiEncoder.encode(['address'], [c.CountdownGriefing.factory[network].address]);
  await deployFactory("CountdownGriefingEscrow", "Erasure_Escrows", agreementFactory);




  const userAddress = "0x6087555A70E2F96B7838806e7743041E035a37e5";
  const proofhash = ethers.utils.sha256(ethers.utils.toUtf8Bytes("proofhash"));
  const IPFShash = createIPFShash("multihash");
  const nmrAddress = "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671";

  async function deployNMR() {
    await deployer.deploy(c.NMR.artifact).then(wrap => {
      // console.log("Wrap contractAddress",wrap.contractAddress,"network",network)
      c.NMR[network] = {
        wrap: wrap,
        address: wrap.contractAddress
      };
      const balance = ethers.utils.parseEther("1000")
      wrap.from(stakerWallet.address).mintMockTokens(stakerWallet.address,balance)

    });


   
}
 
console.log("DONE DEPLOYING")
return [deployer,c]

  async function deployRegistry(registry) {
    await deployer.deploy(c[registry].artifact).then(wrap => {
      // console.log("Wrap contractAddress",wrap.contractAddress,"network",network)
      c[registry][network] = {
        wrap: wrap,
        address: wrap.contractAddress
      };
    });
  }

  async function getRegistry(registry) {

    // get registry at cached address
    c[registry][network].wrap = deployer.wrapDeployedContract(
      c[registry].artifact,
      c[registry][network].address
    );

    // validate ownership
    assert.equal(
      await c[registry][network].wrap.owner(),
      deployer.signer.address
    );

    // console.log(`${registry} has valid owner: ${deployer.signer.address}`);
  }

  async function deployFactory(name, registry, factoryData = ethers.utils.hexlify(0x0)) {
    await deployer.deploy(c[name].template.artifact).then(wrap => {
      c[name].template[network].address = wrap.contractAddress;
    });

    c[name].template[network].wrap = await deployer.wrapDeployedContract(
      c[name].template.artifact,
      c[name].template[network].address
    );

    await deployer
      .deploy(
        c[name].factory.artifact,
        false,
        c[registry][network].address,
        c[name].template[network].address
      )
      .then(wrap => {
        c[name].factory[network].address = wrap.contractAddress;
      });

    c[name].factory[network].wrap = await deployer.wrapDeployedContract(
      c[name].factory.artifact,
      c[name].factory[network].address
    );

    await c[registry][network].wrap
      .addFactory(
        c[name].factory[network].address,
        factoryData,
        { gasPrice: defaultGas }
      )
      .then(async txn => {
        // console.log(
        //   `addFactory() | ${name}_Factory => ${registry}`
        // );
        const receipt = await c[registry][network].wrap.verboseWaitForTransaction(txn);
        // console.log(`gasUsed: ${receipt.gasUsed}`);
        // console.log(``);
        gasUsed = gasUsed.add(receipt.gasUsed);
      });
  }

 
};

module.exports = { deploy };
