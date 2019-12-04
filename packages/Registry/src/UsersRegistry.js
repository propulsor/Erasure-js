const { Contracts } = require("../../Base");
const { ethers } = require("ethers");
const ErasureHelper = require("@erasure/crypto-ipfs");
const assert = require("assert");
/**
 * Erasure_Users has its own methods and doesnt extend Registry class
 */
class Erasure_Users {
  constructor({ wallet = null, provider, network = null }) {
    this.wallet = wallet || ethers.Wallet.createRandom();
    this.provider = provider;
    this.network = network || "mainnet";
    this.contract = new ethers.Contract(
      Contracts.Erasure_Users[network].address,
      Contracts.Erasure_Users.artifact.abi,
      provider
    );
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
  static async getUsers() {
    return await this.contract.getUsers();
  }

  /**
   * Get total users count
   */
  static async getUsersCount() {
    return await this.contract.getUserCount();
  }

  /**
   * Get users from start index to end index
   * @param {start index} start
   * @param {end index} end
   */

  static async getPaginatedUsers(start, end) {
    return await this.contract.getPaginatedUsers(
      ethers.utils.bigNumberify(start),
      ethers.utils.bigNumberify(end)
    );
  }
}

module.exports = Erasure_Users;
