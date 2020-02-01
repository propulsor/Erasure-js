const ethers = require("ethers");
const ganache = require('ganache-cli')

const hexlify = utf8str =>
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8str));

const createIPFShash = string => {
    const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(string));
    const sha2_256 = "0x12"; // uint8
    const bits256 = ethers.utils.hexlify(32);
    const multihash = sha2_256 + bits256.substr(2) + hash.substr(2);

    return multihash;
};

function createSelector(functionName, abiTypes) {
    const joinedTypes = abiTypes.join(",");
    const functionSignature = `${functionName}(${joinedTypes})`;

    const selector = ethers.utils.hexDataSlice(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)),
        0,
        4
    );
    return selector;
}

function createEip1167RuntimeCode(logicContractAddress) {
    return ethers.utils.solidityPack(
        ["bytes10", "address", "bytes15"],
        [
            "0x363d3d373d3d3d363d73",
            logicContractAddress,
            "0x5af43d82803e903d91602b57fd5bf3"
        ]
    );
}

const getLatestContractAddressFrom = async (provider, address,deployer) => {
    const nonce = await deployer.provider.getTransactionCount(address);
    const contractAddress = ethers.utils.getContractAddress({
        from: address,
        nonce: nonce - 1
    });
    return contractAddress;
};

/**
 * This function reflects the usage of abi.encodeWithSelector in Solidity.
 * It prepends the selector to the ABI-encoded values.
 *
 * @param {string} functionName
 * @param {Array<string>} abiTypes
 * @param {Array<any>} abiValues
 */
function abiEncodeWithSelector(functionName, abiTypes, abiValues) {
    const abiEncoder = new ethers.utils.AbiCoder();
    const initData = abiEncoder.encode(abiTypes, abiValues);
    const selector = createSelector(
        functionName,
        abiTypes
    );
    const encoded = selector + initData.slice(2);
    return encoded;
}

// Deployer addresses
const nmrDeployAddress = '0x9608010323ed882a38ede9211d7691102b4f0ba0'
const daiDeployAddress = '0xb5b06a16621616875A6C2637948bF98eA57c58fa'
const uniswapFactoryAddress = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'


const unlocked_accounts = [
  nmrDeployAddress,
  daiDeployAddress,
  uniswapFactoryAddress,
]
let ganacheConfig = {
    port: 8545,
    host: '0.0.0.0',
    unlocked_accounts: unlocked_accounts,
    default_balance_ether: 1000,
    total_accounts: 10,
    hardfork: 'constantinople',
    network:{chainId: 5777, name:"ganache"},
    network_id:"*",
    mnemonic:
      'myth like bonus scare over problem client lizard pioneer submit female collect',
  }

const provider = new ethers.providers.Web3Provider(ganache.provider(ganacheConfig), {chainId:0,name:"ganache"})
provider.getNetwork().then(network => console.log("NETWORK",network))
const wallet = provider.getSigner(1)
const operatorWallet =provider.getSigner(2)
console.log("operator wallet", operatorWallet)
operatorWallet.getAddress(a=>{console.log("ADDRESS",a)}).catch(console.error)
const stakerWallet=provider.getSigner(3)
const counterpartyWallet=provider.getSigner(4)
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
module.exports = {
    hexlify,
    createEip1167RuntimeCode,
    createSelector,
    createIPFShash,
    getLatestContractAddressFrom,
    abiEncodeWithSelector,
    wallet,
    operatorWallet,
    NULL_ADDRESS,
    provider,
    stakerWallet,
    counterpartyWallet,
    encoder:new ethers.utils.AbiCoder()
};
