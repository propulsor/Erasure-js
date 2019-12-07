# NMR ERASURE JS SDK
ErasureJS module compises of:
1. ErasureClient for creating and getting  Users,Feeds,Posts,Agreements,Escrows
2. Core Erasure modules : ErasureFeed,ErasurePost,ErasureAgreements,ErasureEscrows 
3. ErasureGraph : for querying Erasure Protocol graph and listening to events

- Use ethers.js for wallet and provider

# Usage
```
const {ErasureClient,ErasureGraph,ErasureFeeds,ErasurePosts,ErasureAgreements,ErasureEscrow} = require("erasure-js)
```

### Wallet and provider

- Wallet : Implemented using ethers.js wallet module, which can be converted from JSON key file, private ket, mnemonic, or web3 wallet.
  + To learn more check out [Ethers Docs](https://docs.ethers.io)
- Provider: Implemented using ethers.js module, which can be converted from web3Provider

## ErasureClient
```
const client = new ErasureClient({wallet,provider,ipfs,graph})
```
#### METHODS:
- `await client.createUser()`
- `await client.createFeed()`
- `await client.getFeed(address)`
- `await client.getPost({proofHash,feedAddress})`
- `await client.createAgreement()`
- `await client.getAgreement(address)`
- `await client.createEscrow()`
- `await client.getEscrow(address)`
#### Get data from Registry contract
##### Users
- `await client.getAllUsers()`
- `await client.getUsersCount()`
- `await client.getPaginatedUsers(start,end)`
- `await client.getUserData(address)`
##### Feeds
- `await client.getAllFeeds()`
- `await client.getFeedsCount()`
- `await client.getPaginatedFeeds(start,end)`

##### Agreements
- `await client.getAllAgreements()`
- `await client.getAgreementsCount()`
- `await client.getPaginatedAgreements(start,end)`

##### Escrows
- `await client.getAllEscrows()`
- `await client.getEscrowsCount()`
- `await client.getPaginatedEscrows(start,end)`

### ErasureUser:
```
const erasureUser = new ErasureUser({wallet,provider})
```
#### create and register user 

```
const [keypair,confirmedTx] = await erasureUser.createAndRegisterUser({msg,salt})
```
    + How it works:
        1. Create new asym keypair
        2. Upload pubkey to Erasure_User registry
        3. @return keypair

#### Remove user:
```
await erasureUser.removeUser()
```
#### Getters:
```
await client.getUserData(address)
```
### Feed (extends Template)
```
const feed = new ErasureFeed({address,wallet,provider,ipfs,graph})
```
- Create new post: 
```
await feed.createPost(rawData)
```
    + How It works:    
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

- `await feed.reveal()` : Reveal all posts  
- `await feed.getAllEscrows()` : Get all Escrows
- `await feed.offerBuy()` : Create escrow for this feed as buyer
- `await feed.offerSell()` : Create escrow for this feed as seller
- `await feed.offerAsOperator()` : create esrow for this feed as operator
- [Template Methods]()

#### Getters
- Get status of feed (if revealed) : `await feed.status()`
- [Template Methods]()

### ErasurePost : 
```
const post = new ErasurePost({feedAddress,proofHash})
```
####  Reveal Post :
```
const success:bool = await post.reveal({symKey})
```
    +  How it works:
        1. Get the latest post(== proofHash == ipfs path of metadata) of feed from graph
        2. Get metadata from ipfs path
        3. Validate symkey and rawData
        4. Upload symkey and rawData to IPFS 
- Create escrow as seller: `await post.offerSell()`
- Create escrow as buyer:  `await post.offerBuy()`
- Create escrow as operator: `await post.offerAsOperator()`
#### Getters:
- `await post.status()` : Get status if revealed
- `post.owner()`
- `await post.proofHash()`
- `await post.getEscrows()` : Get all Escrows that transact this post
### ErasureAgreement

### ErasureEscrow : 
```
const escrow = new ErasureEscrow({address,wallet,provider,ipfs,graph})
```
#### METHODS
##### Buyer:
- `await escrow.depositPayment(amount)`
- `await escrow.cancel()`
- `await escrow.timeout()`
- `await escrow.retrieveDataFromSeller()`
    + How it works:
        1. Get dataSubmitted of this escrow from the graph
        2. Decrypt data submitted -> symkey
        3. Get Metadata( ipfs path of metadata) from the escrow
        4. Get metadata from IPfS
        5. Get encrypted data from metadata.encryptedDataHash
        6. Decrypt data with symKey
##### Seller
- `await escrow.depositStake(amount)`
- `await escrow.finalize()`
- `await escrow.cancel()`
- `await escrow.deliverKey({symKey)`
    +  How it works:
        1. Get Buyer's pubkey from escrow 
        2. Encrypt symKey with Buyer's pubkey 
        3. Submit the new encrypted symKey to escrow contract

#### GETTERS
- `await escrow.getAgreement()` : Get ErasureAgreement obj of this escrow
- `await escrow.buyer()`
- `await escrow.seller()`
- `await escrow.status()`
- `await escrow.data()`

### ErasureAgreement
```
const agreement = new ErasureAgreement({address,wallet,provider,ipfs,graph})
```
#### METHODS
#### GETTERS

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
COMING SOON : Details of all queries available




# Development

- `yarn`
- `yarn test`

