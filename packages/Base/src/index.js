/**
 * Contract wrapper for Erasure Abis
 * When we have updated ABIs from upstream, this package will need to be udpated as well
 * Default web3 provider is mainnet from infura
 */
const { ethers } = require("ethers");
const Contracts = {
  NMR: {
    artifact: require("../artifacts/MockNMR.json.js"),
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
    artifact: require("../artifacts/Erasure_Agreements.json.js"),
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
    artifact: require("../artifacts/Erasure_Posts.json.js"),
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
    artifact: require("../artifacts/Erasure_Escrows.json.js"),
    mainnet: {
      address: ""
    },
    rinkeby: {
      address: "0xA9FfF710c8687fF1a5bD8031225907917f03319A"
    },
    ganache: {
      address: ""
    }
  },
  Feed: {
    factory: {
      artifact: require("../artifacts/Feed_Factory.json.js"),
      mainnet: {
        address: "0x206780873974878722Ed156544589701832eE920"
      },
      rinkeby: {
        address: "0xa3140871346f4efF924dc874EC6AfD4573232F03"
      },
      ganache: {
        address: ""
      }
    },
    template: {
      artifact: require("../artifacts/Feed.json.js"),
      mainnet: {
        address: "0xA411eB36538a2Ae060A766221E43A94205460369"
      },
      rinkeby: {
        address: "0x7aA06aa3b6D5476c0CE720231E2Add74164f78CD"
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
      artifact: require("../artifacts/SimpleGriefing_Factory.json.js"),
      mainnet: {
        address: "0x67ef9503cf0350dB52130Ef2Ad053E868Bc90FC7"
      },
      rinkeby: {
        address: "0x86afD598Ab5CcBDe770dCb57373E3f4c8E23df95"
      },
      ganache: {
        address: ""
      }
    },
    template: {
      artifact: require("../artifacts/SimpleGriefing.json.js"),
      mainnet: {
        address: "0xC04Bd2f0d484b7e0156b21c98B2923Ca8b9ce149"
      },
      rinkeby: {
        address: "0xda6D8eCd5a56d3ae1741BebbA3Fb382B073DAaFf"
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
      artifact: require("../artifacts/CountdownGriefing_Factory.json.js"),
      mainnet: {
        address: "0xd330e5e9670738D36E31dcb1fde0c08B1895a0b1"
      },
      rinkeby: {
        address: "0xffc062e58CB967d2ca33F9d714257f9f003A3b6d"
      },
      ganache: {
        address: ""
      }
    },
    template: {
      artifact: require("../artifacts/CountdownGriefing.json.js"),
      mainnet: {
        address: "0x89a2958544f86Cc57828dbBf31E2C786f20Fe0a0"
      },
      rinkeby: {
        address: "0x93F75120365129Da3A9E3e23e3AbB857F1ADf5B6"
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
      artifact: require("../artifacts/CountdownGriefingEscrow_Factory.json.js"),
      mainnet: {
        address: ""
      },
      rinkeby: {
        address: "0x51FA999b00aCA5005AE4599b71ef05e32E9A2D00"
      },
      ganache: {
        address: ""
      }
    },
    template: {
      artifact: require("../artifacts/CountdownGriefingEscrow.json.js"),
      mainnet: {
        address: ""
      },
      rinkeby: {
        address: "0x714089F6F615AeFd042982c91b9E89C24878c5E4"
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
Contracts.setAddress = (contractName, network, address) => {
  Contracts[contractName][network].address = address;
};

/**
 * Factory functions
 */

class Factory {
  constructor(contractName, wallet, network, provider, contracts) {
    let contractInstance = new ethers.Contract(
      contracts[contractName].factory[network].address,
      contracts[contractName].factory.artifact.abi,
      provider
    );
    this.provider = provider;
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
      contracts[contractName].factory.artifact.abi
    );
    this.wallet = wallet;
  }

  //GETTERS
  async getInstanceCount() {
    return await this.contract.getInstanceCount();
  }
  async getInstance(index) {
    return await this.contract.getInstance(index);
  }
  async getInstances() {
    return await this.contract.getInstances();
  }
  async getPaginatedInstances(start, end) {
    return await this.contract.getPaginatedInstances(start, end); //todo could revert -> handle
  }
}
class Template {
  constructor(contractName, contractAddress, wallet, provider) {
    let contractInstance = new ethers.Contract(
      contractAddress,
      contracts[contractName].template.artifact.abi,
      provider
    );
    this.contract = contractInstance.connect(wallet);
    this.interface = new ethers.utils.Interface(
      contracts[contractName].template.artifact.abi
    );
    this.wallet = wallet;
  }
  async transferOperator(newOperator) {
    let tx = await this.contract.transferOperator(newOperator);
    return tx.await();
  }
  async renounceOperator() {
    let tx = await this.contract.renounceOperator();
    return tx.await();
  }

  //GETTERS
  async getOperator(){
    return await this.contract.getOperator()
  }
}
module.exports = { Factory, Contracts, Template };
