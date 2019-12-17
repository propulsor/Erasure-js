const assert = require("assert");
const { ethers } = require("ethers");
const {
    hexlify,
    abiEncodeWithSelector,
    NULL_ADDRESS,
    wallet,
    operatorWallet,
    provider
} = require("../utils");
const { Contracts } = require("../../packages/Base");
const { Feed_Factory } = require("../../packages/Feed");

describe("Feed Factory", function() {
    const PROOF = "proof",
        METADATA = "metaData",
        SALT = "salt";
    const proofHash = ethers.utils.sha256(hexlify(PROOF));
    const metaDataHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(METADATA)
    );
    let feedFactory;
    function getFeedInstance(feedAddress) {
        return new ethers.Contract(
            feedAddress,
            Contracts["Feed"].template.artifact.abi,
            provider
        );
    }
    describe("Feed Factory", function() {
        it("1.Should Initialize Feed Factory class with wallet", done => {
            feedFactory = new Feed_Factory({ wallet, provider, network: "ganache" });

            done();
        });
        it("2. Should create new feed WITHOUT salt, WITHOUT operator", async () => {
            let {confirmedTx, feed} = await feedFactory.create({
                proof: PROOF,
                metaData: METADATA
            });
            let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes32", "bytes"],
                [NULL_ADDRESS, proofHash, metaDataHash]
            );
            let newFeedEvent = confirmedTx.events.find(
                e => e.event == "InstanceCreated",
                "No InstanceCreated event found"
            );
            assert.equal(newFeedEvent.args.callData, callData);
            let actualCreator = await feed.owner();
            assert.equal(actualCreator, wallet.address);
            let actualOperator = await feed.operator();
            assert.equal(actualOperator, NULL_ADDRESS);
        });
        it("3. Should create new feed WITHOUT salt, WITH operator", async () => {
            let {confirmedTx, feed} = await feedFactory.create({
                proof: PROOF,
                metaData: METADATA,
                operator: operatorWallet.address
            });

            let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes32", "bytes"],
                [
                    ethers.utils.getAddress(operatorWallet.address),
                    proofHash,
                    metaDataHash
                ]
            );
            let newFeedEvent = confirmedTx.events.find(
                e => e.event == "InstanceCreated",
                "No InstanceCreated event found"
            );
            assert.equal(newFeedEvent.args.callData, callData);
            let actualCreator = await feed.owner();
            let actualOperator = await feed.operator();
            assert.equal(actualCreator, wallet.address, "wrong creator");
            assert.equal(actualOperator, operatorWallet.address, "wrong operator");
        });
        it("4. Should create new feed WITH salt WITHOUT operator", async () => {
            let {confirmedTx, feed} = await feedFactory.create({
                proof: PROOF,
                metaData: METADATA,
                salt: SALT
            });
            let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes32", "bytes"],
                [NULL_ADDRESS, proofHash, metaDataHash]
            );
            let newFeedEvent = confirmedTx.events.find(
                e => e.event == "InstanceCreated",
                "No InstanceCreated event found"
            );
            assert(newFeedEvent.args.instance, "No address for new instance");
            assert.equal(newFeedEvent.args.callData, callData);
            let actualCreator = await feed.owner();
            let actualOperator = await feed.operator();
            assert.equal(actualCreator, wallet.address, "wrong creator");
            assert.equal(actualOperator, NULL_ADDRESS, "wrong operator");
        });
        it("5. Should create new feed WITH salt WITH operator", async () => {
            let {confirmedTx, feed} = await feedFactory.create({
                proof: PROOF,
                metaData: METADATA,
                operator: operatorWallet.address,
                salt: SALT + "1"
            });
            let callData = abiEncodeWithSelector(
                "initialize",
                ["address", "bytes32", "bytes"],
                [operatorWallet.address, proofHash, metaDataHash]
            );
            let newFeedEvent = confirmedTx.events.find(
                e => e.event == "InstanceCreated",
                "No InstanceCreated event found"
            );
            assert(newFeedEvent.args.instance, "No address for new instance");
            assert.equal(newFeedEvent.args.callData, callData);
            let actualCreator = await feed.owner();
            let actualOperator = await feed.operator();
            assert.equal(actualCreator, wallet.address, "wrong creator");
            assert.equal(actualOperator, operatorWallet.address, "wrong operator");
        });
    // it("7. Should get all current feeds from registries", async () => {});
    });
});
