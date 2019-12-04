const RAgreements = require("./src/AgreementsRegistry")
const REscrows = require("./src/EscrowsRegistry")
const RFeeds = require("./src/FeedsRegistry")
const RUsers = require("./src/UsersRegistry")
class Registry{
  constructor({wallet,provider,network=null}){
    this.Users = new RUsers({wallet,provider,network})
    this.Feeds = new RFeeds({wallet,provider,network})
    this.Escrows = new REscrows({wallet,provider,network})
    this.Agreements = new RAgreements({wallet,provider,network})
  }
}

 
module.exports = {Registry}
