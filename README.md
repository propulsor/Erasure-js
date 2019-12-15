# NMR ERASURE JS SDK
ErasureJS module comprises of:
1. ErasureClient for creating and getting  Users,Feeds,Posts,Agreements,Escrows
2. Core Erasure modules : ErasureFeed,ErasurePost,ErasureAgreements,ErasureEscrows 
3. ErasureGraph : for querying Erasure Protocol graph and listening to events

- Use ethers.js for wallet and provider

# Usage
```
const {ErasureClient,ErasureGraph,ErasureFeed,ErasurePost,ErasureAgreement,ErasureEscrow} = require("erasure-js)
```

### Config variables for constructors

- `wallet` : Implemented using ethers.js wallet module, which can be converted from JSON key file, private ket, mnemonic, or web3 wallet.
  + To learn more check out [Ethers Docs](https://docs.ethers.io)
- `provider`: Implemented using ethers.js module, which can be converted from web3Provider
- `ipfs` : Default = infura node, format : `{host:"",port:"",protocol:"https"} `
- `network` (optional) : only used in development env
- `graph` : default to ErasureGraph of provider's network, can passed in custom local graph for development
## ErasureClient
```
const client = new ErasureClient({wallet,provider,ipfs=null:{host:string,post:string,protocol:string},graph=null:string})
```
#### METHODS:
- `await client.createUser() -> ErasureUser`
- `await client.createFeed() -> ErasureFeed`
- `await client.getFeed(address) -> ErasureFeed`
- `await client.getPost({proofHash,feedAddress}) -> ErasurePost`
- `await client.createAgreement() -> ErasureAgreement`
- `await client.getAgreement(address) ->ErasureAgreement`
- `await client.createEscrow() -> ErasureEscrow`
- `await client.getEscrow(address) -> ErasureEscrow`
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
const erasureUser = new ErasureUser({wallet,provider,ipfs,graph})
```
#### create and register user 

```
const [keypair,confirmedTx] = await erasureUser.createAndRegisterUser({msg,salt=null})
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
### Template 
#### Methods: 
- `await owner()`
- `await setMetadata(data)`
- `await denounceOperator()`
- `await transferOperator(address)`
- `await operator()`
- `address` - instance's address
- `contract` - Contract object 
### Feed (extends Template)
```
const feed = new ErasureFeed({address,wallet,provider,ipfs,graph})
```
#### Create new post: 
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
        4. Upload metadata's multihash digest form to feeds as proofhash
        5. Upload metadata and encryptedData to IPFS

- `await feed.reveal()` : Reveal all posts  
- `await feed.getAllEscrows()` : Get all Escrows
- `await feed.offerBuy()` : Create escrow for this feed as buyer
- `await feed.offerSell()` : Create escrow for this feed as seller
- `await feed.offerAsOperator()` : create esrow for this feed as operator
- [Template Methods]()

#### Getters
- Get status of feed (if revealed) : `await feed.status()`
- [Template Methods](#template)

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
- `await post.offerSell()`: Create escrow as seller
- `await post.offerBuy()` : Create escrow as buyer
- `await post.offerAsOperator()` : Create escrow as operator
#### Getters:
- `await post.status()` : Get status if revealed
- `await post.owner()`
- `await post.proofHash()`
- `await post.getEscrows()` : Get all Escrows that transact this post

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
        3. Get Metadata( multihash digest form of metadata) from the escrow
        4. Get metadata from IPfS
        5. Get encrypted data from metadata.encryptedDataHash
        6. Decrypt data with symKey
##### Seller
- `await escrow.depositStake(amount)`
- `await escrow.finalize()`
- `await escrow.cancel()`
- `await escrow.deliverKey({symKey)`
    + How it works:
        1. Get Buyer's pubkey from escrow 
        2. Encrypt symKey with Buyer's pubkey 
        3. Submit the new encrypted symKey to escrow contract

#### GETTERS
- `await escrow.getAgreement()` : Get ErasureAgreement obj of this escrow
- `await escrow.buyer()`
- `await escrow.owner()`
- `await escrow.seller()`
- `await escrow.status()`
- `await escrow.data()`

### ErasureAgreement
```
const agreement = new ErasureAgreement({address,wallet,provider,ipfs,graph})
```
#### METHODS
- `await agreement.reward(amount)`
- `await agreement.punish(amount)`
- `await agreement.releaseStake()`
- `await agreement.timeout()`
- `await agreement.cancel()`
- `await agreement.retrieveStake()` (countdown)
#### GETTERS
- `await agreement.staker()`
- `await agreement.counterparty()`
- `await agreement.owner()`
- `await agreement.status()`
- `await escrow.data()`

## Erasure Graph
```
const {ErasureGraph} = require("erasureJs)
const erasureGraph = new ErasureGraph(network="mainnet") 
```
- Network : 
    + `mainnet` or `rinkery` for accessing Erasure graph public node
    + `ganache` for local node (require having a graph node locally and run deploy graph)
- [Queries available](https://github.com/propulsor/Erasure-sdk/blob/master/packages/GraphClient/Queries.js)

### In development : 
### Listening to subscriptions 
- If no `events` array is passed in, client will listen to all events
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
- `yarn ganache`
- `yarn test`

