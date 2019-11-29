const { ethers } = require("ethers");
const { Contracts } = require("./Contracts");

class Factory {
  constructor({contract, wallet, network, provider}) {
    let contractInstance = new ethers.Contract(
      contract.factory[network].address,
      contract.factory.artifact.abi,
      provider
    );
    this.provider = provider;
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
      contract.factory.artifact.abi
    );
    this.wallet = wallet;
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
      ethers.utils.getAddress(instanceAddress)
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
