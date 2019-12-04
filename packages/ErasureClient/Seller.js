class Seller{
    constructor({escrowAddress,wallet,provider,network=null}){
        this.provider=provider
        this.wallet = wallet.provider? wallet: wallet.connect(provider)
        this.escrow = new CountdownGriefingEscrow({address:escrowAddress,wallet,provider,network})
        this.network=network
    }      
     /**
    * Follow flow to encrypt -> ipfs -> Erasure
    * @param {rawData} rawData 
    */
   async submitPost({rawData,escrowAddress}){

   }
   /**
    * Sending raw data to ipfs
    */
   async revealPost(){}

    //==== Escrow flow ====//
    async depositStake(escrowAddress){}
    async finalize(escrowAddress){}
    async cancel(escrowAddress){}
    async retrieveStake(){}
    async startCountDown(){}//todo why allow seller to start countdown ?
    async isBuyer(escrowAddress){}//return bool
    
    }