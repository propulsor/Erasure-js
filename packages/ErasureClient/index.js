const { Users_Registry, Feeds_Registry,Agreements_Registry,Escrows_Registry } = require("../Registry")
const { CountdownGriefingEscrow } = require("../Escrow")
const { INFURA_IPFS, MAINNET_GRAPH } = require("../Utils")
const IPFS = require("ipfs-mini")
const ErasureGraph = require("../GraphClient")
/**
 * Erasure client for high level getters , Buyer and Seller class
 */

class ErasureClient {
  /**
   * 
   * @param {object} config 
   * @param wallet 
   */
  constructor({ wallet, provider, network = "mainnet", ipfsOpts = INFURA_IPFS, graphUri = MAINNET_GRAPH }) {
    ipfsOpts = ipfsOpts || { host: "ipfs.infura.io", port: "5001", protocol: "https" }
    this.wallet = wallet.provider ? wallet : wallet.connect(provider);
    this.provider = provider;
    this.network = network;
    this.Users_Registry = new Users_Registry({ wallet, provider, network })
    this.Feeds_Registry = new Feeds_Registry({ wallet, provider, network })
    this.Escrows_Registry = new Escrows_Registry({ wallet, provider, network })
    this.Agreements_Registry = new Agreements_Registry({ wallet, provider, network })
    this.ipfs = new IPFS(ipfsOpts)
    this.graph = new ErasureGraph({ network, uri: graphUri })
    this.factoryOpts = { wallet: this.wallet, provider: this.provider, network: this.network }

  }

  // ==== USER ====//
  createAndRegisterUser = this.Users_Registry.createAndRegisterUser
  removeUser = this.Users_Registry.removeUser
  getAllUsers = this.Users_Registry.getUsers
  getUsersCount = this.Users_Registry.getUsersCount
  getPaginatedUsers = this.Users_Registry.getPaginatedUsers
  getUserData = this.Users_Registry.getUserData


  //==== FEEDS ====//
  getAllFeeds = this.Feeds_Registry.getAllFeeds
  getFeedsCount = this.Feeds_Registry.getFeedsCount
  getPaginatedFeeds = this.Feeds_Registry.getPaginatedFeeds


  async createFeed({ proof, metadata, opreator = null, salt = null }) {
    const feedFactory = new ErasureFeed_Factory({ wallet: this.wallet, provider: this.provider, network: this.network })
    return await feedFactory.create({ proof, metadata, salt, operator, ipfs: this.ipfs, graph: this.graph })
  }
  async getFeed(address) {
    return new Feeds_Registry({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }


  //==== POST ====//
  async getPost({proofHash,feedAddress}) {
    return new ErasurePost({wallet:this.wallet,provider:this.provider,proofHash,feedAddress,ipfs:this.ipfs,graph:this.graph})
  }


  //=== AGREEMENTS ====//
  getAgreement = this.Agreements_Registry.getAgreement
  getAgreementsCount = this.Agreements_Registry.getAgreementsCount
  getAgreementData = this.Agreements_Registry.getAgreementData
  getAllAgreements = this.Agreements_Registry.getAllAgreements
  getPaginatedAgreements = this.Agreements_Registry.getPanigatedAgreements

  /**
   * Create CountdownGriefing /SimpleGriefing Agreement
   * @param {Obj} opts 
   */
  async createAgreement({
    staker, counterparty, ratio, ratioType, metadata, operator = null, countdownLength = null, salt = null
  }) {
    let factory = new Agreement_Factory({...this.factoryOpts,countdownLength})
    return await factory.create({ staker, counterparty, ratio, ratioType, metadata, operator, countdownLength, salt, ipfs: this.ipfs, graph: this.graph })
  }
  async getAgreement(address) {
    return ErasureAgreement({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }


  // ==== ESCROW ====//
  getEscrowsCount = this.Escrows_Registry.getEscrowsCount
  getEscrowData=this.Escrows_Registry.getEscrowData
  getAllEscrows=this.Escrows_Registry.getAllEscrows
  getPaginatedEscrows=this.Escrows_Registry.getPaginatedEscrows

  /**
   * 
   * @param {Obj} config
    * @param {string} config.paymentAmount
    * @param {string} config.stakeAmount
    * @param {string} config.escrowCountdown
    * @param {string} config.greifRatio
    * @param {string} config.greifRatioType
    * @param {string} config.agreementCountdown
    * @param {string} [config.operator]
    * @param {string} [config.buyer]
    * @param {string} [config.seller]
    * @param {string} [config.metadata]
    * @returns {Promise} ErasureEscrow object
    * @returns {Promise} transaction receipts
   */
  async createEscrow({
    paymentAmount, stakeAmount,
    escrowCountdown, ratio,
    ratioType, agreementCountdown,
    buyer = null, seller = null,
    operator = null, metadata = null,
    salt = null
  }) {
    const escrowFactory = new CountfownGriefingEscrow_Factory(this.factoryOpts)
    return escrowFactory.create({
      paymentAmount, stakeAmount,
      escrowCountdown, ratio,
      ratioType, agreementCountdown,
      buyer, seller,
      operator, salt,
      metadata,
      ipfs: this.ipfs,
      graph: this.graph
    });
  }

  async getEscrow(address) {
    return new CountdownGriefingEscrow({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }

}


module.export = { ErasureClient }