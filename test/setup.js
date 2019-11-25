const { deploy } = require("./deploy_ganache");
const { Contracts } = require("../packages/Base");
const {ethers} = require("ethers")
before(async () => {
  const contracts = await deploy("ganache", Contracts);
});


