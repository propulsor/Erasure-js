const { Erasure_Users, Erasure_Feeds } = require("../Registry")
const { Feed } = require("../Feed")
const { CountdownGriefingEscrow } = require("../Escrow")
const IPFS = require("ipfs-mini")
const SHA256 = require("crypto-js/sha256")
const ErasureHelper = require("@erasure/crypto-ipfs")
const onlyHash = ErasureHelper.ipfs.onlyHash
/**
 * Erasure client for high level getters , Buyer and Seller class
 */

class ErasureClient {
  constructor({ wallet, provider, network = null, ipfsOpts }) {
    ipfsOpts = ipfsOpts || { host: "ipfs.infura.io", port: "5001", protocol: "https" }
    this.wallet = wallet.provider ? wallet : wallet.connect(provider);
    this.provider = provider;
    this.network = network;
    this.Erasure_Users = new Erasure_Users({ wallet, provider, network })
    this.Erasure_Feeds = new Erasure_Feeds({ wallet, provider, network })
    this.Erasure_Escrows = new Erasure_Escrows({ wallet, provider, network })
    this.ipfsMini = new IPFS(ipfsOpts)
  }

  async getEscrow(address) {
    return new CountdownGriefingEscrow({ address, wallet: this.wallet, provider: this.provider, network: this.network })
  }
  async getFeed(address) {
    return new Feed({ address, wallet: this.wallet, provider: this.provider, network: this.network })
  }

  /**
   * Create Escrow
   * return new escrow instance
   */
  async createEscrow({
    paymentAmount,
    stakeAmount,
    escrowCountdown,
    ratio,
    ratioType,
    agreementCountdown,
    buyer = null,
    seller = null,
    operator = null,
    metadata = null,
    salt = null,
    network = null
  }) {
    let escrow = await CountdownGriefingEscrow.create({
      paymentAmount,
      stakeAmount,
      escrowCountdown,
      ratio,
      ratioType,
      agreementCountdown,
      wallet: this.wallet,
      provider: this.provider,
      buyer,
      seller,
      operator,
      salt,
      metadata,
      network
    });
    this.escrow = escrow;
    this.Buyer = new Buyer({ escrowAddres, wallet, provider, network });
    this.Seller = new Seller({ escrowAddress, wallet, provider, network });
  }

  async createFeed({ proof, metadata, operator = null, salt = null, network = null }) {

  }

  //===USERS===//
  getAllUsers = this.Erasure_Users.getUsers
  getUsersCount = this.Erasure_Users.getUsersCount
  getPaginatedUsers = this.Erasure_Users.getPaginatedUsers
  getUser = this.Erasure_Users.getUser
  removeUser = this.Erasure_Users.removeUser
  createAndRegisterUser = this.Erasure_Users.createAndRegisterUser
  getUserData = this.Erasure_Users.getUserData

  //==== FEEDS ====//

  getAllFeeds = this.Erasure_Feeds.getAllFeeds
  getFeedsCount = this.Erasure_Feeds.getFeedsCount
  getPaginatedFeeds = this.Erasure_Feeds.getPaginatedFeeds
  getFeed = this.Erasure_Feeds.getFeed
  getFeedData = this.Erasure_Feeds.getFeedData

  //==== ESCROWS ====//
  getAllEscrows = this.Erasure_Escrows.getAllEscrows
  getEscrowsCount = this.Erasure_Escrows.getEscrowsCounts
  getPaginatedEscrows = this.Erasure_Escrows.getPaginatedEscrows
  getEscrow = this.Erasure_Escrows.getEscrow
  getEscrowData = this.Erasure_Escrows.getEscrowData


  //=== submit and reveal post ===//
  /**
   * Follow the flow to create symkey, asymkey, encrypt File with
   * @param {raw data} rawData 
   * @param {any msg to sign } msg 
   * @param {salt} salt 
   * @param {optional description} description 
   */
  async submitPost(feedAddress, rawData) {

    const sig = this.wallet.signer.sign(msg)

    //create symkey
    const symKey = ErasureHelper.crypto.symmetric.generateKey()
    const keyHash = await onlyHash(symKey) //ipfs path for symkey (for revealing later)

    //encrypt file with symkey and post to ipfs
    const rawDataHash = await onlyHash(rawData) //ipfs path for raw data (for revealing later)
    const dataEncoded = b64.encode(rawData)
    const encrytpedData = ErasureHelper.crypto.symmetric.encryptMessage(symKey, dataEncoded)
    const encryptedDataHash = await onlyHash(encrytpedData) //ipfs path for encrypted data
    const metadata = {
      address: this.wallet.address,
      rawDataHash,
      keyHash,
      encryptedDataHash

    }
    const proofHash = await onlyHash(metadata) //ipfs hash for metadata
    //submit proofHash to Feed
    const feed = new Feed({ address: feedAddress, wallet: this.wallet, provider: this.provider })
    let tx = await feed.submitProof(proofHash)
    const confirmed = await tx.wait()
    //save encrypted data file and metadata to ipfs
    const encryptedDataIpfsPath = await this.ipfsMini.add(encryptedData)
    assert.equal(encryptedDataIpfsPath,encryptedDataHash,"encrypted data ipfs hash are not the same")
    const proofHashIpfsPath = await this.ipfsMini.addJSON(metadata)
    assert.equal(proofHashIpfsPath,proofHash,"proof hash and ipfs path are not the same")
    //save post locally
    this.posts.push({ symKey,rawData ,...metadata})
    return []
  }

  /**
   * Reveal post at index or the earliest one in the list if no index specified
   * @return ipfs path to decrypted file
   */
  async revealPost(index=0) {
    const post = this.posts[index]
    const symkeyIpfsPath = await this.ipfsMini.add(post.symKey)
    assert.equal(symkeyIpfsPath,post.keyHash,"symkey ipfs path is not the same")
    const rawdataIpfsPath = await this.ipfsMini.add(post.rawData)
    assert.equal(rawdataIpfsPath,post.rawDataHash,"raw data ipfs path is not the same")
    this.posts.splice(index,1)
    return true

  }

/**
 * Seller encrypted symkey with buyer's pubkey and upload to  escrow
 */
  async deliverKey(escrowAddress){
    const escrow = new CountdownGriefingEscrow({address:escrowAddress,wallet:this.wallet,provider:this.provider})
    assert(validateEscrow(escrow))
    const buyer = await escrow.getBuyer()
    const seller = await escrow.getSeller()
    assert.equal(seller,this.wallet.address,"you are not the seller of this escrow")
    const buyerPubkey = await this.Erasure_Users.getUserData()
    // const encryptedSymkey = ErasureHelper.crypto.asymmetric

  }



  //==== Listener for real time events ===//
  async startListening(eventName = null) { } //all event if no eventName passed in
  async getDataFromGraph(eventName = null) { }
}


module.export = { ErasureClient }