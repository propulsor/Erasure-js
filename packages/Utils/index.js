const ethers = require("ethers");
const ErasureHelper= require("@erasure/crypto-ipfs")

const createIPFShash = (data)=>ErasureHelper.multihash({inputType:'raw',outputType:'b58',input:data})
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

async function hexToHash(data){
    return await ErasureHelper.multihash({data,inputType:"hex",outputType:"b58"})
}
function b64(data){
    let buf = Buffer.from(data);
    let encodedData = buf.toString('base64');
    return encodedData
}

const NULL_ADDRESS = ethers.utils.getAddress(
    "0x0000000000000000000000000000000000000000"
);
const RATIO_TYPES = {
    NaN: 0,
    // CgtP: 1,
    // CltP: 2,
    // CeqP: 3,
    Inf: 1,
    Dec: 2
}

const AGREEMENT_STATUS = {
    isTerminated: 2,
    isInCountdown: 1,
    isInitialized: 0
}
const COUNTDOWN_STATUS = {
    isNull: 0,
    isSet: 1,
    isActive: 2,
    isOver: 3
}
const ESCROW_STATUS = {
    isOpen: 0,
    onlyStakedDeposited: 2,
    onlyPaymentDeposited: 3,
    isDeposited: 4,
    isFinalized: 5,
    isCancelled: 6
}

const AGREEMENT_TYPE={
    COUNTDOWN:"CountdownGriefing",
    SIMPLE:"SimpleGriefing"
}
const VERSION_1 = "1.0"
const VERSION_2 = "1.2"
const MAINNET = "mainnet"
const RINKEBY = "rinkeby"
module.exports = {
    hexlify,
    hexToHash,
    createSelector,
    createIPFShash,
    abiEncodeWithSelector,
    b64,
    NULL_ADDRESS,
    RATIO_TYPES,
    ESCROW_STATUS,AGREEMENT_STATUS,AGREEMENT_TYPE,
    VERSION_2,
    VERSION_1,MAINNET,RINKEBY
};
