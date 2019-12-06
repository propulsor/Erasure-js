const { ApolloClient } = require("apollo-client")
const fetch = require("node-fetch")
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const Queries = require("./Queries")
const gql = require("graphql-tag")
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
            else if (network == "ganache") {
                //todo use localgraph
            }
            else {
                throw "Network unknown, please provide uri for graph Erasure"
            }
        }
        const link = createHttpLink({ uri, fetch })
        this.client = new ApolloClient({ cache, link })
        for (let event in Queries) {
            const query = Queries[event]
            this[event] = async (opts = {}) => {
                return await this.query({ opts, eventName: event, returnData: query.returnData })
            }
        }
    }

    /**
     * Query any event name 
     * @param {} queryName (optional)
     * @param {*} eventName 
     * @param {*} opts 
     * @param {*} returnData 
     */
    async query({ queryName = "Erasure", eventName, opts = {}, returnData }) {
        try {
            console.log(queryName, eventName, opts, returnData)
            const query = `query ${queryName}{${eventName}(where:${JSON.stringify(opts)}) {
            ${returnData}
          } }`
            console.log(query)
            const res = await this.client.query({ query: gql`${query}` })
            return res.data
        } catch (e) {
            return e.message
        }

    }
    async querySchema() {
        const query = `query IntrospectionQuery {
            __schema {
              __typename {
                name
              }
            }
          
          }`
        const res = await this.client.query({ query: gql`${query}` })
        return res
    }
    //==== CUSTOM CALLS FOR INTERNAL USE ===//
    /**
     * Get Data Submitted of an escrow
     * @param {*} escrowAddress 
     */
    async getDataSubmitted(escrowAddress) { }

    /**
     * Get Agreement Address of an finalized escrow
     * @param {} escrowAddress 
     */
    async getAgreementOfEscrow(escrowAddress) { }

    /**
     * Get latest post submitted of a feed
     * @param {} feedAddress 
     */
    async getLatestPost(feedAddress) { }
    /**
     * subscribe to events
     * If no evenName specified, will listen to all events
     * */
    async subscribeToEvent(eventName = null) {
    }

}
module.exports = ErasureGraph