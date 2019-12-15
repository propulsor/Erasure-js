const { ethers } = require("ethers");
const IPFS = require("ipfs-mini")
const ErasureGraph = require("../../GraphClient")

class Template {
  constructor({contract, address, wallet, provider,ipfs,graph}) {
    let contractInstance = new ethers.Contract(
        address,
      contract.template.artifact.abi,
      provider
    );
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
        contract.template.artifact.abi
    );
    this.wallet = wallet;
    this.address=address
    this.ipfs=ipfs
    this.graph=graph
  }
  /**
   * set metaData
   * default is only operator can set metaData
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
  async operator() {
    return await this.contract.getOperator();
  }
  async owner() {
    return await this.contract.getCreator();
  }
  

}

module.exports = { Template };
