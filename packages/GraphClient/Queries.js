const Queries = {
    //CountDownEscrow
    countdownGriefingEscrows: {
        dataReturn: ` id: ID!
        creator: Bytes
        operator: Bytes
        buyer: Bytes
        seller: Bytes
        paymentAmount: BigInt
        stakeAmount: BigInt
        countdownLength: BigInt
        agreementParams: Bytes
        deadline: BigInt
        data: Bytes
        dataB58: String
        dataSubmitted: Boolean
        paymentDeposited: Boolean
        stakeDeposited: Boolean
        finalized: Boolean
        cancelled: Boolean
        metadata: Bytes
        metadataB58: String
        countdownGriefingAgreement: CountdownGriefing
        initMetadata: Bytes
        initMetadataB58: String
        initCallData: Bytes
        createdTimestamp: BigInt`
    },
    instanceCreatedCountdownGriefingEscrowFactories: {
        returnData: ` id: ID!
        instance: Bytes!
        creator: Bytes!
        callData: Bytes!
        blockNumber: BigInt!
        timestamp: BigInt!
        txHash: Bytes!
        logIndex: BigInt!`
    },
    cancelledCountdownGriefingEscrows: {
        returnData: ` id: ID!
        blockNumber: BigInt!
        timestamp: BigInt!
        txHash: Bytes!
        logIndex: BigInt!`
    },
    dataSubmittedCountdownGriefingEscrows: {
        returnData: `id: ID!
        data: Bytes!
        blockNumber: BigInt!
        timestamp: BigInt!
        txHash: Bytes!
        logIndex: BigInt!`
    },
    deadlineSetCountdownGriefingEscrows: {
        returnData: `id
        deadline
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    finalizedCountdownGriefingEscrows: {
        returnData: ` id: ID!
        agreement: Bytes!
        blockNumber: BigInt!
        timestamp: BigInt!
        txHash: Bytes!
        logIndex: BigInt!`
    },
    initializedCountdownGriefingEscrows: {},
    metadataSetCountdownGriefingEscrows: {},
    operatorUpdatedCountdownGriefingEscrows: {},
    paymentDepositedCountdownGriefingEscrows: {},
    stakeDepositedCountdownGriefingEscrows: {},
    //CountdownGriefing
    instanceCreatedCountdownGriefingFactories: {},
    initializedCountdownGriefings: {},
    iatioSetCountdownGriefings: {},
    iriefedCountdownGriefings: {},
    iengthSetCountdownGriefings: {},
    iperatorUpdatedCountdownGriefings: {},
    ietadataSetCountdownGriefings: {},
    stakeAddedCountdownGriefings: {},
    stakeTakenCountdownGriefings: {},
    stakeBurnedCountdownGriefings: {},
    deadlineSetCountdownGriefings: {},
    //SimpleGriefing
    simpleGriefings: {},
    instanceCreatedSimpleGriefingFactories: {},
    griefedSimpleGriefings: {},
    initializedSimpleGriefings: {},
    metadataSetSimpleGriefings: {},
    operatorUpdatedSimpleGriefings: {},
    ratioSetSimpleGriefings: {},
    stakeAddedSimpleGriefings: {},
    stakeBurnedSimpleGriefings: {},
    stakeTakenSimpleGriefings: {},
    //Feeds
    feeds: {
        queryName: "Feeds",
        returnData: `id
            creator
            operator
            metadata
            metadataB58
            hashes
            initMetadata
            initMetadataB58
            initCallData
            createdTimestamp`
    },
    instanceCreatedFeedFactories: {},
    hashSubmittedFeeds: {
        returnData: `
        id
        hash
        blockNumber
        timestamp
        txHash
        logIndex
        `
    },
    initializedFeeds: {},
    operatorUpdatedFeeds: {},
    metadataSetFeeds: {}

}

module.exports = Queries