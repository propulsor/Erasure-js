const { ethers } = require("ethers");
const { Contracts } = require("./Contracts");

class Template {
  constructor(contractName, contractAddress, wallet, provider) {
    let contractInstance = new ethers.Contract(
      contractAddress,
      Contracts[contractName].template.artifact.abi,
      provider
    );
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
      Contracts[contractName].template.artifact.abi
    );
    this.wallet = wallet;
  }

  //GETTERS
  async getOperator() {
    return await this.contract.getOperator();
  }
  async getCreator() {
    return await this.contract.getCreator();
  }
  async getFactory() {
    return await this.contract.getFactory;
  }
}

module.exports = { Template };
