const { ethers } = require("ethers");
const { Contracts } = require("./Contracts");

class Factory {
  constructor(contractName, wallet, network, provider) {
    let contractInstance = new ethers.Contract(
      Contracts[contractName].factory[network].address,
      Contracts[contractName].factory.artifact.abi,
      provider
    );
    this.provider = provider;
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
        Contracts[contractName].factory.artifact.abi
    );
    this.wallet = wallet;
  }
  async create(callData) {
    throw "Implementation required";
  }
  async createSalty(callData, salt) {
    throw "Implementation required";
  }

  //GETTERS
  async getInitSelector() {}
  async getInstanceRegistry() {}
  async getTemplate() {}
  async getInstanceCount() {
    return await this.contract.getInstanceCount();
  }

  async getSaltyInstance(calldata, salt) {}
  async getInstanceCreator(instanceAddress) {}
  async getInstanceType() {}
  async getInstance(index) {
    return await this.contract.getInstance(index);
  }
  async getInstances() {
    return await this.contract.getInstances();
  }
  async getPaginatedInstances(start, end) {
    return await this.contract.getPaginatedInstances(start, end); //todo could revert -> handle
  }
}
module.exports = { Factory };
