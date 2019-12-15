#!/bin/bash

# kill ganache on exit
trap 'kill $(jobs -p)' EXIT

# this is awful, but we need to copy this file in order for etherlime to handle the accounts correctly
cp test/etherlime-setup.json node_modules/etherlime/cli-commands/ganache/setup.json
cp test/etherlime-setup.json node_modules/etherlime-config/ganacheSetup.json

yarn run ganache > ganache.log &

sleep 3

OUTPUT="$(yarn run test_mocha)"

echo -e "$OUTPUT"

if echo OUTPUT | grep 'Error'; then
  exit 1
fi
