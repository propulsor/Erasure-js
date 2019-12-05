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
            else {
                throw "Network unknown, please provide uri for graph Erasure"
            }
        }
        const link = createHttpLink({ uri, fetch })
        this.client = new ApolloClient({ cache, link })
    }
    async getQuerys(opts) {
        const query = gql`query getEscrows{ countdownGriefingEscrows(where:${{ ...opts }} ) {
            id
            creator
            operator
            buyer
            metadata
          } }`
        const res = await this.client.query({ query })
        return res
    }
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
    async getPosts(opts){

    }
    async subscribe(name){

    }
    async getDataSubmitted(hash){
        const query = gql`query getFeeds{ feeds(where:${{ ...opts }} ) {
            id
            creator
            operator
            metadata
          } }`
        const res = await this.client.query({ query })
        return res
    }

}
module.exports=ErasureGraph