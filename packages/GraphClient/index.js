const { ApolloClient } = require("apollo-client")
const fetch = require("node-fetch")
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
/**
 * Client to query Erasure data from explorer
 */
class ErasureGraph {
    constructor({ network, uri = null }) {
        const cache = new InMemoryCache();
        if (!uri) {
            if (network == "rinkerby") {
                uri = "https://api.thegraph.com/subgraphs/name/jgeary/erasure-rinkeby120"
            }
            else if (network == "mainnet") {
                uri = "https://thegraph.com/explorer/subgraph/jgeary/erasure"
            }
            else if(network=="ganache"){
                //todo use localgraph
                throw "Network unknown, please provide uri for graph Erasure"
            }
        }
        const link = createHttpLink({ uri, fetch })
        this.client = new ApolloClient({ cache, link })
    }


    /**
     * Query any event name 
     * @param {} queryName 
     * @param {*} eventName 
     * @param {*} opts 
     * @param {*} returnData 
     */
    async query(queryName="ErasureGraph",eventName,opts,returnData){
        const query = gql`query ${queryName}{ ${eventName}(where:${{ ...opts }} ) {
            ${returnData}
          } }`
        const res = await this.client.query({ query })
        return res

    }

    // ==== QUERY INSTANCES ====//

    /**
     * 
     * @param {} opts 
     */
    async queryFeeds(opts) {
        const query = gql`query getFeeds{ feeds(where:${{ ...opts }} ) {
            id
            creator
            operator
            metadata
          } }`
        const res = await this.client.query({ query })
        return res
    }
    async queryCountdownGriefingEscrows(opts){}
    async queryCountdownGriefings(opts){}
    async querySimpleGriefings(opts){}
    // GET SINGLE INSTANCE
    async getCountDownGriefing(address){

    }
    // ESCROW events
    async getFinalizedCountdownGriefingEscrow(address) {
        const query = gql`query dataSubmittedCountdownGriefingEscrows{ feeds(where:{id:${address}} ) {
            id
            data
            blockNumber
            txHash
            timestamp
            logIndex
          } }`
        const res = await this.client.query({ query })
        return res
    }
    async queryEscrows(opts) {
        const query = gql`query getEscrows{ countdownGriefingEscrows(where:${{ ...opts }} ) {
            id
            creator
            operator
            buyer
            seller
            metadata
            data
            dataB58
          } }`
        const res = await this.client.query({ query })
        return res
    }

    async getFinalizedCountdownGriefingEscrow(address){
        const returnData=
        `
        id
        agreement
        timestamp
        blockNumber
        `
        return query("getFinalize","finalizedCountdownGriefingEscrow",{id:address},returnData)
    }
    /**
     * subscribe to events
     * If no evenName specified, will listen to all events
     * */
    async subscribeToEvent(eventName=null) {
    }

}
module.exports = ErasureGraph