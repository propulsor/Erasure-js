const ethers = require("ethers")
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const RATIO_TYPES = {
    NaN: 0,
    // CgtP: 1,
    // CltP: 2,
    // CeqP: 3,
    Inf: 1,
    Dec: 2
};

const AGREEMENT_STATUS = {
    isTerminated: 2,
    isInCountdown: 1,
    isInitialized: 0
};
const COUNTDOWN_STATUS = {
    isNull: 0,
    isSet: 1,
    isActive: 2,
    isOver: 3
};
const ESCROW_STATUS = {
    isOpen: 0,
    onlyStakedDeposited: 2,
    onlyPaymentDeposited: 3,
    isDeposited: 4,
    isFinalized: 5,
    isCancelled: 6
};

const AGREEMENT_TYPE = {
    CountdownGriefing: "CountdownGriefing",
    SimpleGriefing: "SimpleGriefing"
};
const VERSIONS = {
    V1: "V1",
    V2: "V2",
    V3: "V3"
};
const NETWORKS = {
    mainnet: "mainnet",
    rinkeby: "rinkeby",
    kovan: "kovan",
    ganache: "ganache",
    ropsten:"ropsten"
};

const GRAPH_URLS = {
    V1: {
        rinkeby: "",
        mainnet: ""
    },
    V2: {
        rinkeby: "https://thegraph.com/explorer/subgraph/erasureprotocol/rinkeby-v120",
        mainnet: "https://thegraph.com/explorer/subgraph/erasureprotocol/v120"
    },
    V3: {
        rinkeby: "https://thegraph.com/explorer/subgraph/erasureprotocol/rinkeby-v130",
        mainnet: ""
    }
};

module.exports = {
    NULL_ADDRESS,
    RATIO_TYPES,
    ESCROW_STATUS,
    AGREEMENT_STATUS,
    AGREEMENT_TYPE,
    VERSIONS,
    NETWORKS,GRAPH_URLS


};
