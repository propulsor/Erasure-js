const ethers = require("ethers")
const { Users_Registry, Feeds_Registry, Agreements_Registry, Escrows_Registry } = require("../Registry")
const { ErasureEscrow ,Escrow_Factory} = require("../Escrow")
const {Agreement_Factory,ErasureAgreement} = require("../Agreement")
const {ErasureFeed,Feed_Factory} = require("../Feed")
const { INFURA_IPFS, MAINNET_GRAPH ,AGREEMENT_TYPE,VERSIONS,NETWORKS} = require("../Constants")
const IPFS = require("ipfs-mini")
const {ErasureGraph} = require("../GraphClient")


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
    constructor({ wallet=null, provider=null, network = NETWORKS.mainnet,version=VERSIONS.V3, ipfsOpts = INFURA_IPFS, graphUri = MAINNET_GRAPH,contracts=null }={}) {
        ipfsOpts = ipfsOpts || { host: "ipfs.infura.io", port: "5001", protocol: "https" }
        if(!provider){
            if(network==NETWORKS.mainnet){
                provider = new ethers.providers.InfuraProvider()
            }
            else if (network==NETWORKS.rinkeby){
                provider = new ethers.providers.InfuraProvider("rinkeby")
            }
            else{
                network=NETWORKS.ganache
                provider = new ethers.providers.JsonRpcProvider()
            }
        }
        if(!wallet){
            wallet = ethers.Wallet.createRandom()
            wallet.connect(provider)
        }
        this.contracts = contracts
        this.wallet = wallet.provider ? wallet : wallet.connect(provider);
        this.provider = provider;
        this.network = network;
        this.userRegistry = new Users_Registry({ wallet, provider, network ,version,contracts})
        this.feedRegistry = new Feeds_Registry({ wallet, provider, network, version,contracts })
        this.escrowRegistry = new Escrows_Registry({ wallet, provider, network,version,contracts })
        this.agreementRegistry = new Agreements_Registry({ wallet, provider, network,version,contracts })
        this.ipfs = new IPFS(ipfsOpts)
        this.graph = new ErasureGraph({ network, uri: graphUri,version,contracts })
        this.factoryOpts = { wallet, provider, network,version,contracts }
    }



    // ==== USER ====//
    async createAndRegisterUser(opts){return this.userRegistry.createAndRegisterUser(opts)}

    async removeUser(opts) {return this.userRegistry.removeUser(opts)}

    async getAllUsers() {return  this.userRegistry.getUsers()}

    async getUsersCount() {return this.userRegistry.getUsersCount()}

    async getPaginatedUsers(start,end) {return this.userRegistry.getPaginatedUsers(start,end)}

    async getUserData(address) {return  this.userRegistry.getUserData(address)}


    //==== FEEDS ====//
    async getAllFeeds(){return this.feedRegistry.getAllFeeds()}

    async getFeedsCount() {return this.feedRegistry.getFeedsCount()}

    async getPaginatedFeeds(start,end){return this.feedRegistry.getPaginatedFeeds(start,end)}


    /** createFeed
     *
     * Create a new feed
     *
     * @param {Object} config
     * @param {string} [config.operator] optional operator
     * @param {string} [config.proofhash] optional initial post
     * @param {string} [config.metaData] optional metaData
     * @returns {Promise} {feed,confirmedTx} object
     */
    async createFeed({ proof=null, metaData=null, operator = null, salt = null }) {
        const feedFactory = new Feed_Factory({ wallet: this.wallet, provider: this.provider, network: this.network, contracts:this.contracts})
        return await feedFactory.create({ proof, metaData, salt, operator, ipfs: this.ipfs, graph: this.graph })
    }

    /**
   * Get ErasureFeed object of a feedAddress
   * @param {String} address
   */
    async getFeed(address) {
        return new ErasureFeed({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph , contracts:this.contracts})
    }



    //=== AGREEMENTS ====//
    /**
     *
     * @param {string} address
     * @return {ErasureAgreement}
     */
    async getAgreement(address) {

        const agreement =  await this.getAgreementData(address)
        const factoryId = agreement[1]
        const countDownFactoryId = await this.agreementRegistry.getCountDownFactoryId()
        if(factoryId===countDownFactoryId){
            return new ErasureAgreement({type:AGREEMENT_TYPE.COUNTDOWN,address,wallet:this.wallet,provider:this.provider,ipfs:this.ipfs,graph:this.graph,contracts:this.contracts})
        }
        return new ErasureAgreement({type:AGREEMENT_TYPE.SIMPLE,address,wallet:this.wallet,provider:this.provider,ipfs:this.ipfs,graph:this.graph,contracts:this.contracts})

    }

    async getAgreementsCount(){return await this.agreementRegistry.getAgreementsCount()}

    async getAgreementData(address){return await this.agreementRegistry.getAgreementData(address)}

    async getAllAgreements(){return await this.agreementRegistry.getAllAgreements()}

    async getPaginatedAgreements(start,end){return await  this.agreementRegistry.getPanigatedAgreements(start,end)}

    /**
   * Create CountdownGriefing /SimpleGriefing Agreement
    * @param {Object} config
    * @param {string} config.staker
    * @param {string} config.counterparty
    * @param {string} config.griefRatio
    * @param {string} config.griefRatioType
    * @param {string} [config.countdownLength] - creates a simple griefing agreement if not set
    * @param {string} [config.metaData]
    * @param {string} [config.operator]
    * @returns {Promise} ErasureAgreement object
    * @returns {Promise} transaction receipts
   */
    async createAgreement({
        staker, counterparty, ratio, ratioType, metaData, operator = null, countdown = null, salt = null
    }) {
        const type = countdown ? AGREEMENT_TYPE.COUNTDOWN : AGREEMENT_TYPE.SIMPLE
        let factory = new Agreement_Factory({ ...this.factoryOpts, type })
        return await factory.create({ staker, counterparty, ratio, ratioType, metaData, operator, countdown, salt, ipfs: this.ipfs, graph: this.graph })
    }


    // ==== ESCROW ====//
    //getters
    async getEscrowsCount(){return this.escrowRegistry.getEscrowsCount()}

    async getEscrowData(address){return this.escrowRegistry.getEscrowData(address)}

    async getAllEscrows(){return this.escrowRegistry.getAllEscrows()}

    async getPaginatedEscrows(start,end){return this.escrowRegistry.getPaginatedEscrows(start,end)}

    /**
   *
   * @param {Object} config
    * @param {string} config.paymentAmount
    * @param {string} config.stakeAmount
    * @param {string} config.escrowCountdown
    * @param {string} config.greifRatio
    * @param {string} config.greifRatioType
    * @param {Object} config.agreementParams
    *   * @param {Number} config.agreementParams.ratio
        * @param {String} config.agreementParams.ratioType
        * @param {Number} config.agreementParams.agreementCountdown

    * @param {string} [config.operator]
    * @param {string} [config.buyer]
    * @param {string} [config.seller]
    * @param {string} [config.metaData]
    * @returns {Promise} ErasureEscrow object
    * @returns {Promise} transaction receipts
   */
    async createEscrow({
        paymentAmount, stakeAmount,
        countdown, agreementParams,
        buyer = null, seller = null,
        operator = null, metaData = null,
        salt = null
    }) {
        const escrowFactory = new Escrow_Factory(this.factoryOpts)
        return await escrowFactory.create({
            paymentAmount, stakeAmount,
            countdown, agreementParams,
            buyer, seller,
            operator, salt,
            metaData,
            ipfs: this.ipfs,
            graph: this.graph
        });
    }

    /**
   *
   * @param {string} address of escrow
   */
    async getEscrow(address) {
        return new ErasureEscrow({ address, wallet: this.wallet, provider: this.provider, ipfs: this.ipfs, graph: this.graph,contracts:this.contracts })
    }

}


module.exports = { ErasureClient }