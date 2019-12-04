const ErasureHelper = require("@erasure/crypto-ipfs");

class Buyer {
  constructor({ escrow, wallet, provider, network = null }) {
    this.provider = provider;
    this.network = network || "mainnet";
    this.escrow = new CountdownGriefingEscrow({
      address: escrowAddress,
      wallet,
      provider,
      network
    });
    this.wallet = wallet.provider ? wallet : wallet.connect(provider);
  }

  //==== Escrow flow ====//
  async getFile() {} //get data from seller ->ipfs -> decrypt
  async depositPayment() {}
  async reward() {}
  async punish() {}
  async releaseStake() {}
  async cancel() {}
  async timeout() {}
}
