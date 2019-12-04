const ethers = require("ethers");

const hexlify = utf8str =>
  ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8str));

// const createPaddedMultihashSha256 = string => {
//   const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(string));
//   const sha2_256 = ethers.utils.hexZeroPad("0x12", 8); // uint8
//   const bits256 = ethers.utils.hexZeroPad(ethers.utils.hexlify(64), 8);

//   const abiEncoder = new ethers.utils.AbiCoder();
//   const multihash = abiEncoder.encode(
//     ["uint8", "uint8", "bytes32"],
//     [sha2_256, bits256, hash]
//   );
//   return multihash;
// };

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

const getLatestContractAddressFrom = async (provider, address) => {
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

async function assertEvent(contract, txn, eventName, expectedArgs) {
  const receipt = await contract.verboseWaitForTransaction(txn);

  const eventLogs = utils.parseLogs(receipt, contract, eventName);

  // assert that the event with eventName only happened once
  assert.equal(eventLogs.length, 1);

  const [eventArgs] = eventLogs;

  assert.equal(eventArgs.length, expectedArgs.length);

  expectedArgs.forEach((expectedArg, index) =>
    assert.equal(eventArgs[index], expectedArg)
  );
}


const provider = new ethers.providers.JsonRpcProvider();
const wallet = new ethers.Wallet(
  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
  provider
);
const operatorWallet = new ethers.Wallet(
  "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
  provider
);
const stakerWallet= new ethers.Wallet("0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",provider)
const counterpartyWallet=new ethers.Wallet("0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913",provider)
const NULL_ADDRESS = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);
module.exports = {
  hexlify,
  createEip1167RuntimeCode,
  createSelector,
  createIPFShash,
  getLatestContractAddressFrom,
  abiEncodeWithSelector,
  assertEvent,
  wallet,
  operatorWallet,
  NULL_ADDRESS,
  provider,
  stakerWallet,
  counterpartyWallet,
  encoder:new ethers.utils.AbiCoder()
};
