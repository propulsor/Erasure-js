const Queries = {
    //CountDownEscrow
    countdownGriefingEscrows: {
        dataReturn: ` id
        creator
        operator
        buyer
        seller
        paymentAmount
        stakeAmount
        countdownLength
        agreementParams
        deadline
        data
        dataB58
        dataSubmitted
        paymentDeposited
        stakeDeposited
        finalized
        cancelled
        metadata
        metadataB58
        countdownGriefingAgreement
        initMetadata
        initMetadataB58
        initCallData
        createdTimestamp`
    },
    instanceCreatedCountdownGriefingEscrowFactories: {
        returnData: ` id
        instance
        creator
        callData
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    cancelledCountdownGriefingEscrows: {
        returnData: ` id
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    dataSubmittedCountdownGriefingEscrows: {
        returnData: `id
        data
        blockNumber
        timestamp
        txHash
        logIndex`
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
        returnData:`id
        agreement
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    initializedCountdownGriefingEscrows: {
        returnData:`id
        operator
        buyer
        seller
        paymentAmount
        stakeAmount
        countdownLength
        metadata
        metadataB58
        agreementParams
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    metadataSetCountdownGriefingEscrows: {
        returnData:`id
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    operatorUpdatedCountdownGriefingEscrows: {
        returnData:`id
        operator
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    paymentDepositedCountdownGriefingEscrows: {
        returnData:`id
        buyer
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeDepositedCountdownGriefingEscrows: {
        returnData:`id
        seller
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    countdownGriefings:{
        returnData:`id
        creator
        operator
        staker
        currentStake
        totalBurned
        totalTaken
        counterparty
        ratio
        ratioType
        countdownLength
        deadline
        metadata
        metadataB58
        initMetadata
        initMetadataB58
        initCallData
        createdTimestamp`
    },
    instanceCreatedCountdownGriefingFactories: {
        returnData:`id
        instance
        creator
        callData
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    initializedCountdownGriefings: {
        returnData:`id
        operator
        staker
        counterparty
        ratio
        ratioType
        countdownLength
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    ratioSetCountdownGriefings: {
        returnData:`id
        staker
        ratio
        ratioType
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    griefedCountdownGriefings: {
        returnData:`id
        punisher
        staker
        punishment
        cost
        message
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    lengthSetCountdownGriefings: {
        returnData:`id
        length
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    operatorUpdatedCountdownGriefings: {
        returnData:`id
        operator
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    metadataSetCountdownGriefings: {
        returnData:`id
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeAddedCountdownGriefings: {
        returnData:`id
        staker
        funder
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeTakenCountdownGriefings: {
        returnData:`id
        staker
        recipient
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeBurnedCountdownGriefings: {
        returnData:`id
        staker
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    deadlineSetCountdownGriefings: {
        returnData:`id
        deadline
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    simpleGriefings: {
        returnData:`id
        creator
        operator
        staker
        currentStake
        totalBurned
        totalTaken
        counterparty
        ratio
        ratioType
        metadata
        metadataB58
        initMetadata
        initMetadataB58
        initCallData
        createdTimestamp`
    },
    instanceCreatedSimpleGriefingFactories: {
        returnData:`id
        instance
        creator
        callData
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    griefedSimpleGriefings: {
        returnData:`id
        punisher
        staker
        punishment
        cost
        message
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    initializedSimpleGriefings: {
        returnData:`id
        operator
        staker
        counterparty
        ratio
        ratioType
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    metadataSetSimpleGriefings: {
        returnData:`id
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    operatorUpdatedSimpleGriefings: {
        returnData:`id
        operator
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    ratioSetSimpleGriefings: {
        returnData:`id
        staker
        ratio
        ratioType
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeAddedSimpleGriefings: {
        returnData:`id
        staker
        funder
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeBurnedSimpleGriefings: {
        returnData:`id
        staker
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    stakeTakenSimpleGriefings: {
        returnData:``
    },
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
    instanceCreatedFeedFactories: {
        returnData:`id
        staker
        recipient
        amount
        blockNumber
        timestamp
        txHash
        logIndex`
    },
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
    initializedFeeds: {
        returnData:`id
        operator
        proofHash
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    operatorUpdatedFeeds: {
        returnData:`id
        operator
        blockNumber
        timestamp
        txHash
        logIndex`
    },
    metadataSetFeeds: {
        returnData:`id
        metadata
        metadataB58
        blockNumber
        timestamp
        txHash
        logIndex`
    }

}

module.exports = Queries