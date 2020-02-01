const ethers = require("ethers");
const ErasureHelper = require("@erasure/crypto-ipfs");
const { ErasureV1, ErasureV2, ErasureV3 } = require("@erasure/abis");
const Buffer = require("buffer");
const { VERSIONS, NETWORKS } = require("../Constants");

const createIPFShash = data =>
  ErasureHelper.multihash({ inputType: "raw", outputType: "b58", input: data });
const hexlify = utf8str =>
  ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8str));

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
  const selector = createSelector(functionName, abiTypes);
  const encoded = selector + initData.slice(2);
  return encoded;
}

async function hexToHash(data) {
  return await ErasureHelper.multihash({
    data,
    inputType: "hex",
    outputType: "b58"
  });
}
function b64(data) {
  let buf = Buffer.from(data);
  let encodedData = buf.toString("base64");
  return encodedData;
}
function getContractMetadata({ contractName, version, network ,contracts=null}) {
  if(network==NETWORKS.ganache){
    // get contract data from local ?
    console.log("GET contract from local")
    if(!contracts){
      throw "contracts objecy is needed for local deployment"
    }
    let contract
    
    if(contractName.includes("Factory"))
      contract = contracts[contractName.replace("Factory","")].factory
    else if(["Feed","Posts","CountdownGriefing","SimpleGriefing","CountdownGriefingEscrow"].includes(contractName)){
      contract = contracts[contractName].template
    }
    else
    {
      contract = contracts[contractName]
    }
    console.log("contract name and contract", contractName,contract.wrap.address)
    // console.log("get contract metadta ", contract.wrap.address, contract.wrap.interface.abi)
    return {
      address: contract.wrap.address,
      artifact : contract.wrap.interface.abi
    }
    
  }
  else{
    if (!VERSIONS[version]) {
      throw "Invalid version, V1,V2,V3 are available";
    }
    if (!NETWORKS[network]) {
      throw "Invalid network, mainnet or rinkeby for v1,v2 and optional kovan for v3";
    }
    switch (version) {
      case VERSIONS.V1:
        return {
          address: ErasureV1[contractName][`${network}Address`],
          artifact: ErasureV1[contractName].artifact
        };
      case VERSIONS.V2:
        return {
          address: ErasureV2[contractName][`${network}Address`],
          artifact: ErasureV2[contractName].artifact
        };
      default:
        return {
          address: ErasureV3[contractName][`${network}Address`],
          artifact: ErasureV3[contractName].artifact
        };
    }
  }
}
module.exports = {
  getContractMetadata,
  hexlify,
  hexToHash,
  createSelector,
  createIPFShash,
  abiEncodeWithSelector,
  b64
};
