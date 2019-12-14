const { Template, Contracts } = require("../Base");
const { ethers } = require("ethers");
const { hexlify ,createIPFShash,b64} = require("../Utils");
const ErasureHelper = require("@erasure/crypto-ipfs")
const assert = require("assert")

class ErasureFeed extends Template {
  /**
   * @param {} feedAddress
   * @param {*} wallet
   * @param {*} provider
   */
  constructor(opts) {
    super({contract:Contracts.Feed, ...opts});
  }

  /**
   * Submit proofHash to add to feed
   * @param {string} sha256 of metadata 
   */
  async submitProof(proof) {
    let tx = await this.contract.submitHash(proof);
    return await tx.wait();
  }

  /**
   *Override setMetadata method because Feed creator can also set metadata
   * @param {*} data
   */
  async setMetadata(data) {
    const feedMetadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
    let tx = await this.contract.setMetadata(feedMetadata);
    return await tx.wait();
  }

   /**
   * 1. Create symkey
   * 2. Encrypt data with symkey
   * 3. Create MetaData of ipfs hash of data,encryptedData,key
   * 4. create ipfs hash of metadata and push hash to feed
   * 5. push encryptedData and proofHash to ipfs
   * @param {raw data} rawData 
   * @param {any msg to sign } msg 
   * @param {salt} salt 
   * @param {optional description} description 
   */

  async createPost( rawData) {
    //create symkey
    const symKey = ErasureHelper.crypto.symmetric.generateKey()
    const keyHash = await createIPFShash(symKey) //ipfs path for symkey (for revealing later)

    //encrypt file with symkey and post to ipfs
    const rawDataHash = await createIPFShash(rawData) //ipfs path for raw data (for revealing later)
    const dataEncoded = b64(rawData)
    const encryptedData = ErasureHelper.crypto.symmetric.encryptMessage(symKey, dataEncoded)
    const encryptedDataHash = await createIPFShash(encryptedData) //ipfs path for encrypted data
    const metadata = {
      address: this.wallet.address,
      rawDataHash,
      keyHash,
      encryptedDataHash
    }
    const proofHash = await ErasureHelper.multihash({input:JSON.stringify(metadata), inputType:'raw', outputType:'digest'}) 
    //submit proofHash to Feed
    let confirmedTx = await this.submitProof(proofHash)
    //save encrypted data file and metadata to ipfs
    const encryptedDataIpfsPath = await this.ipfs.add(encryptedData)
    assert.equal(encryptedDataIpfsPath, encryptedDataHash, "encrypted data ipfs hash are not the same")
    const proofHashIpfsPath = await this.ipfs.addJSON(metadata)
    return {symKey,confirmedTx}

  }

/**
   * Reveal all posts
   * @return Array of ipfs path to keys and metadata
   * //TODO get all posts from graph, check if reveal, if not -> reveal
   */
  async reveal({ symKey, rawData }) {
    const symKeyIpfs = await this.ipfs.add(symKey)
    const rawDataIpfs = await this.ipfs.add(rawData)
    return {symKeyIpfs, rawDataIpfs}
  }
  /**
   * get all escrows to transact this feed (from graph)
   * @returns {Promise} array of {ipfsKeyHash,ipfsEncryptedData}
   * */
  async getEscrows(){
    await this.graph.getEscrowsForFeed(this.wallet.address)
  }

  /**
  * Create a new CountdownGriefingEscrow as seller and deposit stake
     * - only called by feed owner
     * - add feed address to metadata
     * - add feed owner as staker
     *
     * @param {Object} config - configuration for escrow
     * @param {string} [config.buyer]
     * @param {string} config.paymentAmount
     * @param {string} config.stakeAmount
     * @param {number} config.escrowCountdown
     * @param {string} config.ratio
     * @param {number} config.ratioType
     * @param {number} config.agreementCountdown
     * @returns {Promise} Erasure.Escrow obj
     * @returns {Promise}  createTx : confirmed receipts of escrow creation tranaction
     * @returns {Promise}  createTx : confirmed receipts of depositing stake tranaction
   */
  async offerSell({stakeAmount,paymentAmount,ratio,ratioType,escrowCountdown,buyer=NULL_ADDRESS}){
    const owner = await this.owner()
    assert.equal(this.wallet.address,owner,"Only feed owner can offer sell")
    const factory = new CountdownGriefingEscrow_Factory({wallet:this.wallet,provider:this.provider})
    const [createTx,escrow]= await factory.create({seller:owner,stakeAmount,paymentAmount,ratio,ratioType,escrowCountdown,buyer})
    const sTx = await escrow.depositStake(stakeAmount)
    const stakeTx = await stakeTx.wait()
    return {createTx,stakeTx,escrow}
  }

    /**
  * Create a new CountdownGriefingEscrow sa buyer and deposit payment
     * - add feed address to metadata
     * - add feed owner as staker
     *
     * @param {Object} config - configuration for escrow
     * @param {string} [config.buyer]
     * @param {string} config.paymentAmount
     * @param {string} config.stakeAmount
     * @param {number} config.escrowCountdown
     * @param {string} config.ratio
     * @param {number} config.ratioType
     * @param {number} config.agreementCountdown
     * @returns {Promise} Erasure.Escrow obj
     * @returns {Promise}  createTx : confirmed receipts of escrow creation tranaction
     * @returns {Promise}  createTx : confirmed receipts of depositing stake tranaction
   */
  async offerBuy(){
    const factory = new CountdownGriefingEscrow_Factory({wallet:this.wallet,provider:this.provider})
    const [createTx,escrow]= await factory.create({buyerr:await this.owner(),stakeAmount,paymentAmount,ratio,ratioType,escrowCountdown,seller})
    const sTx = await escrow.depositStake(stakeAmount)
    const stakeTx = await stakeTx.wait()
    return {createTx,stakeTx,escrow}  }


  /**
   * Get all posts of this feed address (from graph)
   * @return {Promise} Array of post objects
   */
  async getPosts(){
    let posts=[]
    const posts = await this.graph.getPosts(this.address)
    return posts.map(item=>{return item.hash})
  }
}

module.exports = { ErasureFeed };
