const {Contracts} = require("../../Base")
const {ethers} = require("ethers")
const assert = require("assert")
/**
 * Erasure_Users has its own methods and doesnt extend Registry class
 */
class Erasure_Users {
    constructor(wallet,provider,network=null){
        this.wallet=wallet
        this.provider = provider
        this.network=network || "mainnet"
        this.contract = new ethers.Contract(Contracts.Erasure_Users[network].address,Contracts.Erasure_Users.artifact.abi,provider)
        this.contract.connect(wallet)
    }
    async registerUser(data){
        let userData = await this.contract.getUserData(this.wallet.address)
        assert(!userData,"User existed")
        let dataHash = ethers.utils.keccak256(ethers.utils.hexlify(data))
        let tx = await this.contract.registerUser(dataHash)
        return await tx.wait()
    }
    async removeUser(){
        let userData =await this.contract.getUserData(this.wallet.address)
        assert(userData,"User doesnt exist")
        let tx = await this.contract.removeUser()
        return await tx.wait()
    }
    async getUserData(){
        return await this.contract.getUserData()
    }
    async getUsers(){
        return await this.contract.getUsers()
    }
    async getUserCount(){
        return await this.contract.getUserCount()
    }
    async getPaginatedUsers(start,end){
        return await this.contract.getPaginatedUsers(ethers.utils.bigNumberify(start),ethers.utils.bigNumberify(end))
    }
}

module.exports=Erasure_Users