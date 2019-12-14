const { Users_Registry, Feeds_Registry, Agreements_Registry, Escrows_Registry } = require("../Registry")
const { ErasureEscrow ,Escrow_Factory} = require("../Escrow")
const {ErasureAgreement,Agreement_Factory} = require("../Agreement")
const {ErasureFeed,Feed_Factory} = require("../Feed")
const { INFURA_IPFS, MAINNET_GRAPH } = require("../Utils")
const IPFS = require("ipfs-mini")
const ErasureGraph = require("../GraphClient")


class ErasureClient {
  /**
   * 
   * @param {object} config 
   * @param {Obj} config.wallet - web3 wallet or ethers wallet
   * @param {Obj} config.provider - web3 or ethers provider
   * @param {string} config.network - "mainnet", "rinkerby","ganache"
   * @param {Obj} [config.ipfsOpts] - ipfs confif : {host,port,protocol}
   * @param {graphUri} [config.graphUri] - graph uri for ErasureGraph
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
  async createAndRegisterUser(opts){return this.Users_Registry.createAndRegisterUser(opts)}
  async removeUser(opts) {return this.Users_Registry.removeUser(opts)}
  async getAllUsers() {return  this.Users_Registry.getUsers()}
  async getUsersCount() {return this.Users_Registry.getUsersCount()}
  async getPaginatedUsers(start,end) {return this.Users_Registry.getPaginatedUsers(start,end)}
  async getUserData(address) {return  this.Users_Registry.getUserData(address)}


  //==== FEEDS ====//
  async getAllFeeds(){return this.Feeds_Registry.getAllFeeds()}
  async getFeedsCount() {return this.Feeds_Registry.getFeedsCount()}
  async getPaginatedFeeds(start,end){return this.Feeds_Registry.getPaginatedFeeds(start,end)}


     /** createFeed
     * 
     * Create a new feed
     *
     * @param {Object} config
     * @param {string} [config.operator] optional operator
     * @param {string} [config.proofhash] optional initial post
     * @param {string} [config.metadata] optional metadata
     * @returns {Promise} {feed,confirmedTx} object
     */
  async createFeed({ proof=null, metadata=null, operator = null, salt = null }) {
    const feedFactory = new Feed_Factory({ wallet: this.wallet, provider: this.provider, network: this.network })
    return await feedFactory.create({ proof, metadata, salt, operator, ipfs: this.ipfs, graph: this.graph })
  }
  /**
   * Get ErasureFeed object of a feedAddress
   * @param {String} address 
   */
  async getFeed(address) {
    return new ErasureFeed({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }



  //=== AGREEMENTS ====//
  async getAgreement(address) {return this.Agreements_Registry.getAgreement(address)}
  async getAgreementsCount(){return this.Agreements_Registry.getAgreementsCount()}
  async getAgreementData(address){this.Agreements_Registry.getAgreementData(address)}
  async getAllAgreements(){return this.Agreements_Registry.getAllAgreements()}
  async getPaginatedAgreements(start,end){return  this.Agreements_Registry.getPanigatedAgreements(start,end)}

  /**
   * Create CountdownGriefing /SimpleGriefing Agreement
    * @param {Object} config
    * @param {string} config.staker
    * @param {string} config.counterparty
    * @param {string} config.griefRatio
    * @param {string} config.griefRatioType
    * @param {string} [config.countdownLength] - creates a simple griefing agreement if not set
    * @param {string} [config.metadata]
    * @param {string} [config.operator]
    * @returns {Promise} ErasureAgreement object
    * @returns {Promise} transaction receipts
   */
  async createAgreement({
    staker, counterparty, ratio, ratioType, metadata, operator = null, countdownLength = null, salt = null
  }) {
    let factory = new Agreement_Factory({ ...this.factoryOpts, countdownLength })
    return await factory.create({ staker, counterparty, ratio, ratioType, metadata, operator, countdownLength, salt, ipfs: this.ipfs, graph: this.graph })
  }

  /**
   * Get Agreement from agreement address
   * @param {string} address of agreement
   */
  async getAgreement(address) {
    return ErasureAgreement({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }


  // ==== ESCROW ====//
  //getters
  async getEscrowsCount(){return this.Escrows_Registry.getEscrowsCount()}
  async getEscrowData(address){return this.Escrows_Registry.getEscrowData(address)}
  async getAllEscrows(){return this.Escrows_Registry.getAllEscrows()}
  async getPaginatedEscrows(start,end){return this.Escrows_Registry.getPaginatedEscrows(start,end)}

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
    const escrowFactory = new Escrow_Factory(this.factoryOpts)
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

  /**
   * 
   * @param {string} address of escrow
   */
  async getEscrow(address) {
    return new ErasureEscrow({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph })
  }

}


module.export = { ErasureClient }