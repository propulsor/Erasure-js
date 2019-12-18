const { ApolloClient } = require("apollo-client")
const fetch = require("node-fetch")
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const {MAINNET,RINKEBY,VERSION_1,VERSION_2} = require("../Utils")
const Queries_v1 = require("./Queries_v1")
const Queries_v2 = require("./Queries_v2")
const gql = require("graphql-tag")

/**
 * Client to query Erasure data from explorer
 */
class ErasureGraph {
    constructor({ network=RINKEBY, uri = null, version=VERSION_2 }={}) {
        const cache = new InMemoryCache();
        let Queries
        if(version == VERSION_2 && network==MAINNET){
            throw "Erasure Graph V2 is only available in rinkeby"
        }
        if (!uri) {
            if (network == RINKEBY) {
                uri = "https://api.thegraph.com/subgraphs/name/jgeary/erasure-rinkeby120"
            }
            else if (network == "mainnet") {
                uri = "https://thegraph.com/explorer/subgraph/jgeary/erasure"
            }
            else {
                throw "Network unknown, please provide uri for graph Erasure"
                //TODO local graph
            }
        }
        if(version == VERSION_1){
            Queries = Queries_v1
        }
        else{
            Queries = Queries_v2
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
            const query = `query ${queryName}{${eventName}(where:${JSON.stringify(opts)}) {
            ${returnData}
          } }`
            const res = await this.client.query({ query: gql`${query}` })
            return res.data[eventName]
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
    async getDataSubmitted(escrowAddress) {
        const query = `query getDataSubmit{
            dataSubmittedCountdownGriefingEscrow(where:{contractAddress:${escrowAddress}})
                data
        }`
        const res = await this.query({query:gql`${query}`})
        return res.data
    }

    /**
     * Get Agreement Address of an finalized escrow
     * FIXMe how to do this with escrow address?
     * @param {} escrowAddress
     */
    async getAgreementOfEscrow(escrowAddress) {
        const query = `query getAgreements{
            countdownGriefingEscrows(where:{id:${escrowAddress}}){
                countdownGriefingAgreement{
                    id
                }
            }
        }`
        const res =  await this.query({query:gql`${query}`})
        return res.id
    }

    /**
     * Get all posts submitted to a feed
     * @param {} feedAddress
     */
    async getPosts(feedAddress) {
        const query = `query getLatestpost{
            feeds(where:{id:${feedAddress}}){
                id
                hashes
            }
        }`
        const res = await this.query({query:gql`${query}`})
        return res.hashes
    }

    /**
     * subscribe to events
     * If no evenName specified, will listen to all events
     * TODO
     * */
    async subscribeToEvent(eventName = null) {
    }

}
module.exports = {ErasureGraph}