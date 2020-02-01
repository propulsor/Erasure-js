const { ethers } = require("ethers");
const { VERSIONS, NETWORKS } = require("../../Constants");
const { getContractMetadata } = require("../../Utils");

class Factory {
  constructor({
    contractName,
    wallet,
    provider,
    network = NETWORKS.mainnet,
    version = VERSIONS.V3,
    contracts=null
  }) {
    console.log("opts in factory", contractName,network,version)
    const { address, artifact } = getContractMetadata({
      contractName,
      version,
      network,contracts
    });
    console.log("address from utils", contractName,address)
    let contractInstance = new ethers.Contract(address, artifact, provider);
    this.provider = provider;
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(artifact);
    this.wallet = wallet;
    this.network=network
    this.version=version
    this.contracts=contracts
  }

  //==== methods with required implementation
  async create(callData) {
    throw "Implementation required";
  }

  //====GETTERS====//
  async getInitSelector() {
    return await this.contract.getInitSelector();
  }

  async getInstanceRegistry() {
    return await this.contract.getInstanceRegistry();
  }

  async getTemplate() {
    return await this.contract.getTemplate();
  }

  async getInstanceCount() {
    return await this.contract.getInstanceCount();
  }

  async getSaltyInstance(calldata, salt) {
    return await this.contract.getSaltyInstance(
      calldata,
      ethers.utils.formatBytes32String(salt)
    );
  }

  async getInstanceCreator(instanceAddress) {
    return await this.contract.getInstanceCreator(
      instanceAddress
    );
  }

  async getInstanceType() {
    return await this.contract.getInstanceType();
  }

  async getInstance(index) {
    return await this.contract.getInstance(ethers.utils.bigNumberify(index));
  }

  async getInstances() {
    return await this.contract.getInstances();
  }

  async getPaginatedInstances(start, end) {
    return await this.contract.getPaginatedInstances(
      ether.utils.bigNumberify(start),
      ethers.utils.bigNumberify(end)
    );
  }
}
module.exports = { Factory };
