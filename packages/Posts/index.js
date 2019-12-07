class ErasurePost{
    constructor({proofHash,feedAddress,ipfs,graph,wallet,provider}){
        this.proofHash =proofHash,
        this.feedAddress = feedAddress

    }
    //==== GETTERS ====//

    proofHash(){
        return this.proofHash
    }
    owner(){
        return this.feedAddress
    }
    async status(){
        return await this.graph.getPostStatus({proofHash:this.proofHash,feedAddress:this.feedAddress})
    }
    async getEscrows(){
        return await this.graph.getEscrowsOfPost({proofHash:this.proofHash,feedAddress:this.feedAddress})
    }


    //==== METHODS ===//
    /**
     * Create escrow to sell this post, has to be the creator of feed
     */
    async offerSell(){}

    /**
     * Create escrow to buy this post, cant be the creator of the feed
     */
    async offerBuy(){}

    /**
     * Reveal this post
     */
    async reveal(){

    }
    

}