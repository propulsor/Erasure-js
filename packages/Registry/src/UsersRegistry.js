const { Contracts } = require("../../Base");
const { ethers } = require("ethers");
const ErasureHelper = require("@erasure/crypto-ipfs");
const assert = require("assert");
/**
 * Erasure_Users has its own methods and doesnt extend Registry class
 */
class Users_Registry {
    constructor({ wallet, provider, network = "mainnet" }) {
      console.error("provider here", provider)
        this.wallet = wallet;
        this.provider = provider;
        this.network = network;
        this.contract = new ethers.Contract(
            Contracts.Erasure_Users[network].address,
            Contracts.Erasure_Users.artifact.abi,
            provider
        );
        console.log("contract address : ",      Contracts.Erasure_Users[network].address    )
        this.contract.connect(wallet);
    }

    /**
   * Register existing pubkey of user to registry
   * @param {pubkey} pubkey
   */
    async createAndRegisterUser({msg, salt}) {
        const sig = this.wallet.signer.sign(msg);
        this.keypair = ErasureHelper.crypto.asymmetric.generateKeyPair(sig, salt);
        const dataHash = ethers.utils.keccak256(
            ethers.utils.hexlify(keypair.publicKey)
        );
        const tx = await this.contract.registerUser(dataHash);
        return [keypair, await tx.wait()];
    }

    /**
   * Remove current user from registry
   */
    async removeUser() {
        let userData = await this.contract.getUserData(this.wallet.address);
        assert(userData, "User doesnt exist");
        let tx = await this.contract.removeUser();
        return await tx.wait();
    }

    /**
   * Get current user's data
   */
    async getUserData(address = null) {
        return await this.contract.getUserData(ethers.utils.getAddress(address||this.wallet.address));
    }

    //==== STATIC METHODS ====//

    /**
   * Get all users from registry
   */
    async getUsers() {
        return await this.contract.getUsers();
    }

    /**
   * Get total users count
   */
    async getUsersCount() {
        const userCount =  await this.contract.getUserCount();
        return userCount.toString()
    }

    /**
   * Get users from start index to end index
   * @param {start index} start
   * @param {end index} end
   */

    async getPaginatedUsers(start, end) {
        return await this.contract.getPaginatedUsers(
            ethers.utils.bigNumberify(start),
            ethers.utils.bigNumberify(end)
        );
    }
}

module.exports = Users_Registry;
