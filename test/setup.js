const {deploy} = require("./deploy_ganache")
const {Contracts} = require("../packages/Base")
before(async()=>{
    const contracts = await deploy("ganache",Contracts)
    return contracts
})