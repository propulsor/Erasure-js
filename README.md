# NMR ERASURE JS SDK
ErasureJS module compises of 2 parts
1. ErasureClient for simplify the flow of Users,Posts and Escrow
2. ErasureGraph for querying Erasure Protocol graph and listening to events

- Use ethers.js for wallet and provider

# Usage
```
const Erasure = require("erasure-js)
```

- Erasure.ErasureClient
- Erasure.ErasureGraph

### Wallet and provider

- Works mainly with ethers.js provider and wallet, which can be converted from JSON key file, private ket, mnemonic, or web3 wallet.
  - To learn more check out [Ethers Docs](https://docs.ethers.io)

## ErasureClient
```
const ErasureClient = Erasure.ErasureClient
const client = new Erasure({wallet=null,provider})
```
- If no wallet is provided, only getters will be available

### User:
#### create and register user 
```
    const [keypair,confirmedTx] = await client.createAndRegisterUser({msg,salt})
```
- How it works:
1. Create new asym keypair
2. Upload pubkey to Erasure_User registry
3. @return keypair

#### Remove user:
    ```
    await client.removeUser()
    ```
#### Getters:
```
    await client.getAllUsers()
    await client.getPaginatedUsers(start,end)
    await client.getUser(address)
    await client.getUsersCount()
    await client.getUserData(address)
```
### Feed 
#### Create feed
```
const feed:Erasure.Feed = await client.createFeed({proof,metadata,operator=null,salt=null})
```

#### Get existing feed
```
const feed:Erasure.Feed = client.getFeed(feedAddress)
```
#### Getters
```
    await client.getAllFeeds()
    await client.getPaginatedFeeds(start,end)
    await client.getFeed(address)
    await client.getFeedsCount()
    await client.getFeedData()
```    
### Post : 
#### Create new post: 
    ```
    const metadataObj = await client.submitPost({feedAddress,rawData})
    ```
- How It works:    
1. Create symkey
2. Encrypt rawData with symkey
3. Create metadata object:
{
    address: this.wallet.address,
    rawDataIpfsHash
    symkeyIpfsHash
    encryptedIpfsHash
}
4. Upload metadata's ipfs hash to feeds as proofhash
5. Upload metadata and encryptedData to IPFS

####  Reveal Post :
    ```
        const success:bool = await client.revealPost({feedAddress,symKey,rawData})
    ```
- How it works:
1. Get the latest post(== proofHash == ipfs path of metadata) of feed from graph
2. Get metadata from ipfs path
3. Validate symkey and rawData
4. Upload symkey and rawData to IPFS 

### Escrow : 
-  Create Escrow :
     ``` 
     const escrow:Erasure.Escrow = await client.createEscrow({paymentAmount,stakeAmount,ratio,ratioType,agreementCountdown,buyer=null,seller=null,operator=null,salt=null,metadata=null})
     ```
- Get existing Escrow
    ```
    const escrow:Erasure.Escrow = client.getEscrow(address)
    ```

#### Deliver Key from Seller to Buyer:
```
    await client.deliverKey({escrowAddress,symkey})
```
-  How it works:
1. Get Buyer's pubkey from escrow 
2. Encrypt symKey with Buyer's pubkey 
3. Submit the new encrypted symKey to escrow contract
#### Retrieve Data from Seller
```
    await client.retrieveDataFromSeller({escrowAddress,keypair}) 
```
- How it works:
1. Get dataSubmitted of this escrow from the graph
2. Decrypt data submitted -> symkey
3. Get Metadata( ipfs path of metadata) from the escrow
4. Get metadata from IPfS
5. Get encrypted data from metadata.encryptedDataHash
6. Decrypt data with symKey
####  Seller's methods
```
    await client.submitPost({feedAddress,rawData})
    await client.revealPost({proofHash,symkey})
    await client.deliverKey({escrowAddress,symkey})
    await client.depositStake({escrowAddress,amount})
    await client.finalize(escrowAddress)
    await client.cancel(escrowAddress)
    await client.retrieveSTake(escrowAddress)
```
#### Buyer's methods
```
    await client.retrieveDataFromSeller({escrowAddress,keypair}) 
    await client.depositPayment({escrowAddress,amount})
    await client.reward({escrowAddress,amount})
    await client.punish({escrowAddress,msg=null,amount})
    await client.releaseStake(escrowAddress)
    await client.cancel(escrowAdress)
    await client.timeout(escrowAdress)
```  
#### Getters
```
    await client.getAllEscrows()
    await client.getPaginatedEscrows(start,end)
    await client.getEscrowsCount()
    await client.getEscrow(address)
    await client.getEscrowData(address)
```  

## ErasureGraph
```
    const {ErasureGraph} = require("erasureJs)
    const erasureGraph = new ErasureGraph(network="mainnet") 
```
- Network : 
    + `mainnet` or `rinkery` for accessing Erasure graph public node
    + `ganache` for local node (require having a graph node locally and run deploy graph)
### Listening to subscriptions 
- If no eventName array is passed in, client will listen to all events
```
    erasureGraph.startListening(events=null,cb) 
```
### Query the graph
```
    erasrureGraph.query(queryName=null,eventName,opts:Obj,returnData:String)
```




# Development

- `yarn`
- `yarn test`

