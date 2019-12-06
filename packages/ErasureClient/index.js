const { Erasure_Users, Erasure_Feeds } = require("../Registry")
const { Feed } = require("../Feed")
const { CountdownGriefingEscrow } = require("../Escrow")
const { ESCROW_STATUS, hexToHash } = require("../Utils")
const IPFS = require("ipfs-mini")
const ErasureHelper = require("@erasure/crypto-ipfs")
const gql = require("graphql-tag")
const onlyHash = ErasureHelper.ipfs.onlyHash
/**
 * Erasure client for high level getters , Buyer and Seller class
 */

class ErasureClient {
  constructor({ wallet, provider, network = "mainnet", ipfsOpts, graphUri = null }) {
    ipfsOpts = ipfsOpts || { host: "ipfs.infura.io", port: "5001", protocol: "https" }
    this.wallet = wallet.provider ? wallet : wallet.connect(provider);
    this.provider = provider;
    this.network = network;
    this.Erasure_Users = new Erasure_Users({ wallet, provider, network })
    this.Erasure_Feeds = new Erasure_Feeds({ wallet, provider, network })
    this.Erasure_Escrows = new Erasure_Escrows({ wallet, provider, network })
    this.ipfsMini = new IPFS(ipfsOpts)
    this.graphClient = new ErasureGraph({ network, uri: graphUri })
  }

  // ==== USER's METHODS ====//
  removeUser = this.Erasure_Users.removeUser
  createAndRegisterUser = this.Erasure_Users.createAndRegisterUser

  // ==== ESCROW ====//

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
    metadata, //metadata is required(proofHash)
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
    return escrow
  }



  //=== SELLER's METHODS ===//

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
  async submitPost({ feedAddress, rawData }) {

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
    assert.equal(encryptedDataIpfsPath, encryptedDataHash, "encrypted data ipfs hash are not the same")
    const proofHashIpfsPath = await this.ipfsMini.addJSON(metadata)
    assert.equal(proofHashIpfsPath, proofHash, "proof hash and ipfs path are not the same")
    return confirmed
  }

  /**
   * Reveal post at index or the earliest one in the list if no index specified
   * @return ipfs path to decrypted file
   */
  async revealPost({ feedAddress, symKey, rawData }) {
    const proofHashHex = await this.erasureGraph.getLatestPost(feedAddress)
    const proofIpfsHash = hexToHash(proofHashHex)
    const metadata = await this.ipfsMini.cat(proofIpfsHash)
    const symkeyIpfsPath = await onlyHash(symKey)
    assert.equal(symkeyIpfsPath, metadata.keyHash, "symkey ipfs path is not the same")
    const rawdataIpfsPath = await onlyHash(rawData)
    assert.equal(rawdataIpfsPath, metadata.rawDataHash), "raw data ipfs path is not the same")
    const symKeyIpfs = await this.ipfsMini.add(symKey)
    const rawDataIpfs = await this.ipfsMini.add(rawData)
    return [symKeyIpfs, rawDataIpfs]
  }

  /**
   * Deliver key of a purchase to escrow
   * Seller encrypted symkey with buyer's pubkey and upload to  escrow
   */
  async deliverKey({ escrowAddress, symKey }) {
    const escrow = new CountdownGriefingEscrow({ address: escrowAddress, wallet: this.wallet, provider: this.provider })
    const status = await escrow.getEscrowStatus()
    assert.equal(status, ESCROW_STATUS.isFinalized, "escrow is not finalized")
    assert(this.validateEscrow(escrow))
    const buyer = await escrow.getBuyer()
    const seller = await escrow.getSeller()
    assert.equal(seller, this.wallet.address, "you are not the seller of this escrow")
    const buyerPubkey = await this.Erasure_Users.getUserData(buyer)
    // Encrypt symkey with buyer's pubkey
    const encryptedSymkey = crypto.publicEncrypt(buyerPubkey, Buffer.from(symKey))
    //send Encrypted symkey to escrow 
    return await escrow.submitData(encryptedSymkey)
  }

  /**
  * Seller retrive stake after the countdown is over 
  */
  async retrieveStake() {
    const escrow = new CountdownGriefingEscrow({ address: escrowAddress, wallet: this.wallet, provider: this.provider })
    const status = await escrow.getStatus()
    const seller = await escrow.getSeller()
    assert.equal(buyer, this.wallet.address, "This wallet is not the buyer of this escrow")
    assert.equal(status, ESCROW_STATUS.isFinalized, "escrow is not finalized")
    const countdownGriefing = await this.erasureGraph.getCountdownGriefing({ id: escrowAddress })
    const griefing = new CountdownGriefing({ address: countdownGriefing })
    //countdown has to be over
    const griefingStatus = await griefing.getAgreementStatus()
    assert.equal(griefingStatus, COUNTDOWN_STATUS.isTerminated, "Countdown is not over yet")
    return await griefing.retrieveStake()
  }
  /**
   * Only Seller or Operator
   * @param {} Escrow Address and amount
   */
  async depositStake({ escrowAddress, amount }) {
    const countdownGriefing = await this.erasureGraph.getCountdownGriefing({ id: escrowAddress })
    const griefing = new CountdownGriefing({ address: countdownGriefing })
    return await griefing.depositStake(amount)
  }

  /**
   * Only Seller or operator
   * Only when escrow status is isDeposited
   * @param {*} escrowAddress 
   */
  async finalize(escrowAddress) {
    const countdownGriefing = await this.erasureGraph.getCountdownGriefing({ id: escrowAddress })
    const griefing = new CountdownGriefing({ address: countdownGriefing })
    return await griefing.finalize()
  }


  // ==== BUYER's METHODs ====//
  /**
   * Buyer call escrow to get encrypted symkey, decrypt, get encrypted data from ipfs, decrypt, return rawdata
   * If data is verified by sha256 -> call releaseStake for seller
   * 
   * @param {escrow instance address} escrowAddress 
   * @return rawData:string
   */
  async retrieveDataFromSeller({ escrowAddress, keypair }) {
    const escrow = new CountdownGriefingEscrow({ address: escrowAddress, wallet: this.wallet, provider: this.provider })
    const status = await escrow.getStatus()
    const buyer = await escrow.getBuyer()
    assert.equal(buyer, this.wallet.address, "This wallet is not the buyer of this escrow")
    assert.equal(status, ESCROW_STATUS.isFinalized, "escrow is not finalized")
    //get submitted data from grapth based on the escrowAddress
    const dataSubmitted = await this.erasureGraph.getDataSubmitted({ id: this.wallet.addres })
    //decrypt data with this user's privkey
    const decryptedSymkey = crypto.privateDecrypt(keypair.privateKey, Buffer.from(dataSubmitted))
    //get path for encrypted data from escrow? //TODO 
    const metadataHash = await escrow.getMetadata()
    const metadataIpfsHash = hexToHash(metadataHash)
    const metadata = await this.ipfsMini.cat(metadataIpfsHash)
    const encryptedDataIpfsPath = metadata.encryptedFileIpfsPath
    const encryptedData = await this.ipfsMini.cat(encryptedDataIpfsPath)
    //decrypt data
    const rawData = ErasureHelper.crypto.symmetric.decryptMessage(decryptedSymkey, encryptedData)
    assert.equal(await onlyHash(rawData), metadata.rawDataHash, "encrypted data is different from raw data")
    return rawData
  }

  /**
   * Only Buyer
   * After retrieving data from seller, buyer can call release stake before countdown is over
   */
  async releaseStake(escrowAddress) {
    const countdownGriefing = await this.erasureGraph.getCountdownGriefing({ id: escrowAddress })
    const griefing = new CountdownGriefing({ address: countdownGriefing })
    return await griefing.releaseStake()
  }

  /**
   * Only Buyer or operator
   * Only when escrow is finalized
   * @param {} param0 
   */
  async reward({ escrowAddress, amount }) {
    const finalized = await this.erasureGraph.getFinalizedCountdownGriefingEscrow(escrowAddress)
    const countDownGriefing = new CountdownGriefing({ address: finalized.agreement, wallet: this.wallet, provider: this.provider })
    return await countDownGriefing.reward(amount)
  }

  /**
   * Only Buyer or Operator
   * Only when escrow is finalized 
   * @param {} param0 
   */
  async punish({ escrowAddress, amount, msg = null }) {
    const finalized = await this.erasureGraph.getFinalizedCountdownGriefingEscrow(escrowAddress)
    const countDownGriefing = new CountdownGriefing({ address: finalized.agreement, wallet: this.wallet, provider: this.provider })
    return await countDownGriefing.punish({ amount, msg })
  }

  /**
   * Buyer or operator
   * Only after deposit and countdown is over
   * Only when no data was submitted
   * @param {} escrowAddress 
   */
  async timeout(escrowAddress) {
    const finalized = await this.erasureGraph.getFinalizedCountdownGriefingEscrow(escrowAddress)
    const countDownGriefing = new CountdownGriefing({ address: finalized.agreement, wallet: this.wallet, provider: this.provider })
    return await countDownGriefing.punish({ amount, msg })
  }

  // ==== BUYER OR SELLER OR OPERATOR ===//

  async cancel(escrowAddress) {
    const escrow = new CountdownGriefingEscrow({ address: escrowAddress, wallet: this.wallet, provider: this.provider })
    return await escrow.cancel()
  }

  // ==== GETTERS ====//

  //===USERS===//
  getAllUsers = this.Erasure_Users.getUsers
  getUsersCount = this.Erasure_Users.getUsersCount
  getPaginatedUsers = this.Erasure_Users.getPaginatedUsers
  getUser = this.Erasure_Users.getUser
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
}


module.export = { ErasureClient }