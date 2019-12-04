# NMR ERASURE JS SDK
ErasureJS module compises of 2 parts
1. Javascript wrapper for contracts of NMR Erasure protocol
2. ErasureClient for simplify the flow of Users,Posts and Escrow

- Use ethers.js for wallet and provider

# Usage
```
const Erasure = require("erasure-js)
```

- Erasure.ErasureClient
- Erasure.Feed
- Erasure.CountdownGriefing
- Erasure.SimpleGriefing
- Erasure.CountdownGriefingEscrow
- Erasure.Registry.Users
- Erasure.Registry.Feeds
- Erasure.Registry.Agreements
- Erasure.Registry.Escrows
### Wallet and provider

- Works mainly with ethers.js provider and wallet, which can be converted from JSON key file, private ket, mnemonic, or web3 wallet.
  - To learn more check out [Ethers Docs](https://docs.ethers.io)

## ErasureClient
```
const ErasureClient = Erasure.ErasureClient
const client = new Erasure({wallet,provider})
```

### User:
-  create and register user - this method will create new asym keypair and upload pubkey to Erasure_User registry
    ```
    const [keypair,confirmedTx] = await client.createAndRegisterUser({msg,salt})
    ```
- Remove user:
    ```
    await client.removeUser()
    ```
- Getters:
```
    await client.getAllUsers()
    await client.getPaginatedUsers(start,end)
    await client.getUser(address)
    await client.getUsersCount()
    await client.getUserData(address)
```
### Feed 
-  Create feed
    ```
    const feed:Erasure.Feed = await client.createFeed({proof,metadata,operator=null,salt=null})
    ```
- Get existing feed
    ```
    const feed:Erasure.Feed = client.getFeed(feedAddress)
    ```
- Getters
```
    await client.getAllFeeds()
    await client.getPaginatedFeeds(start,end)
    await client.getFeed(address)
    await client.getFeedsCount()
    await client.getFeedData()
```    
### Post : 
- Create new post: 
    + This method will follow the flow (create symkey -> encrypt -> load to ipfs -> upload to Erasure Feeds registry )
    ```
    const metadataObj = await client.submitPost({})
    ```
-  Reveal Post :
    + This method will upload symkey and raw data to ipfs
    ```
        const success:bool = await client.revealPost()
    ```
- Getters
    + Get from graph //todo
### Escrow : 
-  Create Escrow :
     ``` 
     const escrow:Erasure.Escrow = await client.createEscrow({paymentAmount,stakeAmount,ratio,ratioType,agreementCountdown,buyer=null,seller=null,operator=null,salt=null,metadata=null})
     ```
- Get existing Escrow
    ```
    const escrow:Erasure.Escrow = client.getEscrow(address)
    ```
- Getters
```
    await client.getAllEscrows()
    await client.getPaginatedEscrows(start,end)
    await client.getEscrowsCount()
    await client.getEscrow(address)
    await client.getEscrowData(address)
```  
####  Seller's methods
```
    await client.submitPost()//todo
    await client.revealPost()
    await escrow.depositStake(amount)
    await escrow.finalize()
    await escrow.cancel()
    await escrow.startCountDown()
    await escrow.retrieveSTake()
```
#### Buyer's methods
```
    await client.getFile() //todo
    await escrow.depositPayment(amount)
    await escrow.reward(amount)
    await escrow.punish(amount)
    await escrow.releaseStake()
    await escrow.cancel()
    await escrow.timeout()
```  

#### Listening to events
- If no eventName array is passed in, client will listen to all events
```
    client.startListening(events=null,cb) 
```


## Contract Wrappers
### Purpose
- *Wrappers serve the purpose of only interacting with contracts with no added logic of encryption or ipfs*
- *Object returned from client.create or client.get are wrappers *



### Template
- Template's methods:
    + setMetadata(data) (only creator or operator )
    + renounceOperator (only operator)
    + transferOperator( only creator or operator) 

### Erasure.Feed ( extends Template):

```
    const feed = new Erasure.Feed({address,wallet,provider}) 
    const feed = Erasure.Feed.create({proof,metadata,wallet,provider,operator=null,salt=null})
```
- Methods:
    + `await feed.submitProof(data)`
    + `await feed.setMetadata()`  (*can be from creator/operator*)
  - [Templates methods]()

### Erasure.SimpleGriefing

  ```
  const simpleGriefing = Erasure.SimpleGriefing.create(
      {staker,counterparty,ratio,ratioType,metadata,wallet,provider,operator=null}
      )
    const simpleGriefing = new Erasure.SimpleGriefing({address,wallet,provider})
    
  ```
- State Methods:
    + `await simpleGriefing.increaseStake(amount)`
    + `await simpleGriefing.reward(amount)`
    + `await simpleGriefing.punish({amount,msg})`
    + `await simpleGriefing.releaseStake(amount)`
    + `await simpleGriefing.retrieveStake(amount)`
- Getter Methods
    + `await simpleGriefing.getStaker()`
    + `await simpleGriefing.getCounterParty(amount)`
    + `await simpleGriefing.getCurrentStake(amount)`
    + `await simpleGriefing.getAgreementStatus(amount)`
### Erasure.CountdownGriefing

  ```
  const countdownGriefing = Erasure.CountdownGriefing.create(
      {staker,counterparty,ratio,ratioType,metadata,wallet,provider,operator=null}
      )
    const countdownGriefing = new Erasure.CountdownGriefing({address,wallet,provider})
    
  ```
- State Methods:
    + `await countdownGriefing.increaseStake(amount)`
    + `await countdownGriefing.reward(amount)`
    + `await countdownGriefing.punish({amount,msg})`
    + `await countdownGriefing.releaseStake(amount)`
    + `await countdownGriefing.startCountDown()`
    + `await countdownGriefing.retrieveStake(amount)`
- Getter Methods
    + `await countdownGriefing.getStaker()`
    + `await countdownGriefing.getCounterParty(amount)`
    + `await countdownGriefing.getCurrentStake(amount)`
    + `await countdownGriefing.getAgreementStatus(amount)`
   
### CountdownGriefingEscrow

  ```
  const escrow = Erasure.CountdownGriefingEscrow.create(
      {staker,counterparty,ratio,ratioType,metadata,wallet,provider,operator=null}
      )
    const escrow = new Erasure.CountdownGriefingEscrow({address,wallet,provider})
    
  ```
- Methods:
### Registry

- *You can use Regsitry to get information about all users, feeds, agreements and escrows in Erasure protocol*
``` 
    const registry = new Erasure.Registry({wallet,provider})
```
#### Registry.Users
- ` await registry.Users.getAllUsers()`
- ` await registry.Users.getUsersCount()`
- ` await registry.Users.getPaginatedUsers(start,end)`
- ` await registry.Users.getUser(address)`
- ` await registry.Users.getUserData(address)`
#### Registry.Feeds
- ` await registry.Feeds.getAllFeeds()`
- ` await registry.Feeds.getFeedsCount()`
- ` await registry.Feeds.getPaginatedFeeds(start,end)`
- ` await registry.Feeds.getFeed(address)`
- ` await registry.Feeds.getFeedData(address)`
#### Registry.Escrows
- ` await registry.Escrows.getAllEscrows()`
- ` await registry.Escrows.getEscrowsCount()`
- ` await registry.Escrows.getPaginatedEscrows(start,end)`
- ` await registry.Escrows.getEscrow(address)`
- ` await registry.Escrows.getEscrowData(address)`
#### Registry.Agreements
- ` await registry.Agreements.getAllAgreements()`
- ` await registry.Agreements.getAgreementsCount()`
- ` await registry.Agreements.getPaginatedAgreements(start,end)`
- ` await registry.Agreements.getAgreement(address)`
- ` await registry.Agreements.getAgreementData(address)`

# Development

- `yarn`
- `yarn test`