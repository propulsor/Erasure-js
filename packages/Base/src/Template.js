const { ethers } = require("ethers");

class Template {
  constructor(contractObj, contractAddress, wallet, provider) {
    let contractInstance = new ethers.Contract(
      contractAddress,
      contractObj.template.artifact.abi,
      provider
    );
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
      contractObj.template.artifact.abi
    );
    this.wallet = wallet;
  }
  /**
   * set metadata
   * default is only operator can set metadata
   * @param {*} data
   */
  async setMetadata(data) {
    const actualOpertor = await this.contract.getOperator();
    assert.equal(
      actualOpertor,
      wallet.address,
      "Only Operator can set Metadata"
    );
    const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
    let tx = await this.contract.setMetadata(feedMetadata);
    return await tx.wait();
  }

  /**
   * Tranfer permit from old to new operator, has to be operator or creator
   * @param {*} newOperator
   */
  async transferOperator(newOperator) {
    let tx = await this.contract.transferOperator(
      ethers.utils.getAddress(newOperator)
    );
    return await tx.wait();
  }

  /**
   * Renounce operator,
   * Has to be operator or creator
   */
  async renounceOperator() {
    let tx = await this.contract.renounceOperator();
    return await tx.wait();
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
