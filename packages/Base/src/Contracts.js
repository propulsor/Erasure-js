const Contracts = {
    NMR: {
        artifact: require("../artifacts/MockNMR.json"),
        mainnet: {
            address: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
        },
        rinkeby: {
            address: "0x1A758E75d1082BAab0A934AFC7ED27Dbf6282373"
        },
        ganache: {
            address: ""
        }
    },
    Erasure_Agreements: {
        artifact: require("../artifacts/Erasure_Agreements.json"),
        mainnet: {
            address: "0xa6cf4Bf00feF8866e9F3f61C972bA7C687C6eDbF"
        },
        rinkeby: {
            address: "0xf46D714e39b742E22eB0363FE5D727E3C0a8BEcC"
        },
        ganache: {
            address: ""
        }
    },
    Erasure_Posts: {
        artifact: require("../artifacts/Erasure_Posts.json"),
        mainnet: {
            address: "0x348FA9DcFf507B81C7A1d7981244eA92E8c6Af29"
        },
        rinkeby: {
            address: "0x57EB544cCA126D356FFe19D732A79Db494ba09b1"
        },
        ganache: {
            address: ""
        }
    },
    Erasure_Escrows: {
        artifact: require("../artifacts/Erasure_Escrows.json"),
        mainnet: {
            address: "0x348FA9DcFf507B81C7A1d7981244eA92E8c6Af29"
        },
        rinkeby: {
            address: "0x57EB544cCA126D356FFe19D732A79Db494ba09b1"
        },
        ganache: {
            address: ""
        }
    },
    Erasure_Users: {
        artifact: require("../artifacts/Erasure_Users.json"),
        mainnet: {
            address: "0x789D0082B20A929D6fB64EB4c10c68e827AAB7aB"
        },
        rinkeby: {
            address: "0xbF7339e68b81a1261FDF46FDBe916cd88f3609c0"
        },
        ganache: {
            address: ""
        }
    },
    Feed: {
        factory: {
            artifact: require("../artifacts/Feed_Factory.json"),
            mainnet: {
                address: "0x206780873974878722Ed156544589701832eE920"
            },
            rinkeby: {
                address: "0xDE19C478b2eD51668e36704b2341b81DEBFe2c40"
            },
            ganache: {
                address: ""
            }
        },
        template: {
            artifact: require("../artifacts/Feed.json"),
            mainnet: {
                address: "0xA411eB36538a2Ae060A766221E43A94205460369"
            },
            rinkeby: {
                address: "0x91faaf60aadcce295e2a99b98dd77421f3517f16"
            },
            ganache: {
                address: ""
            }
        },
        instance: {
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: ""
            },
            ganache: {
                address: ""
            }
        }
    },
    SimpleGriefing: {
        factory: {
            artifact: require("../artifacts/SimpleGriefing_Factory.json"),
            mainnet: {
                address: "0x67ef9503cf0350dB52130Ef2Ad053E868Bc90FC7"
            },
            rinkeby: {
                address: "0x4e278036DB69b7D96352Bc3cdB89B5eE7d31E2a6"
            },
            ganache: {
                address: ""
            }
        },
        template: {
            artifact: require("../artifacts/SimpleGriefing.json"),
            mainnet: {
                address: "0xC04Bd2f0d484b7e0156b21c98B2923Ca8b9ce149"
            },
            rinkeby: {
                address: "0x1f1e4Fb5E496910A0A0EeeBF979A49E69cd11321"
            },
            ganache: {
                address: ""
            }
        },
        instance: {
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: ""
            },
            ganache: {
                address: ""
            }
        }
    },
    CountdownGriefing: {
        factory: {
            artifact: require("../artifacts/CountdownGriefing_Factory.json"),
            mainnet: {
                address: "0xd330e5e9670738D36E31dcb1fde0c08B1895a0b1"
            },
            rinkeby: {
                address: "0x2523f1195537626317Bc0b07e29Afb9F704B510e"
            },
            ganache: {
                address: ""
            }
        },
        template: {
            artifact: require("../artifacts/CountdownGriefing.json"),
            mainnet: {
                address: "0x89a2958544f86Cc57828dbBf31E2C786f20Fe0a0"
            },
            rinkeby: {
                address: "0xaD4Fe9BB39C92E145eD200E19E5C475F7ab0A100"
            },
            ganache: {
                address: ""
            }
        },
        instance: {
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: ""
            },
            ganache: {
                address: ""
            }
        }
    },
    CountdownGriefingEscrow: {
        factory: {
            artifact: require("../artifacts/CountdownGriefingEscrow_Factory.json"),
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: "0xE11290a6841198423198744d1222401a2aa5C3d0"
            },
            ganache: {
                address: ""
            }
        },
        template: {
            artifact: require("../artifacts/CountdownGriefingEscrow.json"),
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: "0x4cC2FBBB2e93c5bffd09Ac9177D65Db95F649daC"
            },
            ganache: {
                address: ""
            }
        },
        instance: {
            mainnet: {
                address: ""
            },
            rinkeby: {
                address: ""
            },
            ganache: {
                address: ""
            }
        }
    }
};
module.exports = { Contracts };
