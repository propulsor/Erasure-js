# NMR ERASURE JS SDK

- Javascript wrapper for interacting with contracts of NMR Erasure protocol
- Use ethers.js for wallet and provider

## Development

- `yarn`
- `yarn test`

## Usage

```
const Erasure=require("erasure")
```

### Structure

- Erasure object

```Erasure :
    {
        Feed,
        CountdownGriefing,
        SimpleGriefing,
        CountdownGriefingEscrow,
        Registry:{
            Users,
            Feeds,
            Escrows,
            Agreements
        }
```

### Wallet and provider

- Works mainly with ethers.js provider and wallet, which can be converted from JSON key file, private ket, mnemonic, or web3 wallet.
  - To learn more check out [Ethers Docs](https://docs.ethers.io)

## Methods

### Templates
- Template methods:
    + setMetadata(data) (only creator or operator )
    + renounceOperator (only operator)
    + transferOperator( only creator or operator) 

#### Feeds:

- Create new Feed:

  `const newFeed = Erasure.Feed.create({proof,metadata,wallet,provider,operator=null,salt=null})`

- Instantiate from existed feed:

  `const feed = new Erasure.Feed({address,wallet,provider})`

  - Submit proof:

    `const confirmedTx = await feed.submitProof(proof)`

  - [Templates methods]()

#### SimpleGriefing

- Create new SimpleGriefing agreements:
  ```
  const simpleGriefing = Erasure.SimpleGriefing.create(
      {staker,counterparty,ratio,ratioType,metadata,wallet,provider,operator=null}
      )
  ```

#### CountdownGriefing

#### Escrows

#### CountdownGriefingEscrow

### Registry

- You can use Regsitry to see information about all users, feeds, agreements and escrows in Erasure protocol

#### Registry.Users

#### Registry.Feeds

#### Registry.Escrows

#### Registry.Agreements
