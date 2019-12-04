const { Erasure_Users, Erasure_Feeds } = require("../Registry")
const { Feed } = require("../Feed")
const { CountdownGriefingEscrow } = require("../Escrow")
/**
 * Erasure client for high level getters , Buyer and Seller class
 */

class Erasure {
  constructor({ wallet, provider, network = null }) {
    this.wallet = wallet.provider ? wallet : wallet.connect(provider);
    this.provider = provider;
    this.network = network;
    this.Erasure_Users = new Erasure_Users({ wallet, provider, network })
    this.Erasure_Feeds = new Erasure_Feeds({ wallet, provider, network })
    this.Erasure_Escrows = new Erasure_Escrows({ wallet, provider, network })
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
getAllUsers=this.Erasure_Users.getUsers
getUsersCount = this.Erasure_Users.getUsersCount
getPaginatedUsers = this.Erasure_Users.getPaginatedUsers
getUser=this.Erasure_Users.getUser
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




    //==== Listener for real time events ===//
    async startListening(eventName = null) { } //all event if no eventName passed in
    async getDataFromGraph(eventName = null) { } 
}
