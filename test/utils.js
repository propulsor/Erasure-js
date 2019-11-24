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

module.exports = {
  hexlify,
  createEip1167RuntimeCode,
  createSelector,
  createIPFShash,
  getLatestContractAddressFrom,
  abiEncodeWithSelector,
  assertEvent
};
