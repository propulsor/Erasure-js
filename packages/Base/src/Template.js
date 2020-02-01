const { ethers } = require("ethers");
const assert = require("assert")
const {NETWORKS,VERSIONS} = require("../../Constants")
const {getContractMetadata} =require("../../Utils")

class Template {
    constructor({contractName, wallet, provider,ipfs,graph,network=NETWORKS.mainnet,version=VERSIONS.V3,contracts=null}) {
        console.log("contract feed info", contractName,network,version)
        const {address,artifact} = getContractMetadata({contractName,version,network,contracts}) 
        let contractInstance = new ethers.Contract(
            address,
            artifact,
            provider
        );
        this.contract = contractInstance.connect(wallet);
        this.wallet = wallet;
        this.address=address
        this.ipfs=ipfs
        this.graph=graph
        this.version=version
        this.network=network
        this.contract.getCreator().then(console.log).catch(console.error)
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
            this.wallet.address,
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
            newOperator
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
