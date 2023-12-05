const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  api_keys: {
    etherscan: "SX5QKV22W1FR2YVZ7CJGH5JQHJD1RVH8CI",
  },

  networks: {
    //   development: {
    //     host: "127.0.0.1",
    //     port: "7545",
    //     network_id: "*", // match any network id
    //   },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          "e5192f9f1624b3f639baf5a19ac5592f36c5537dc3dcc82a868bad80380cd815",
          "https://goerli.infura.io/v3/a69ed761c67446308105f5fccb8c6d0a"
        ),
      network_id: 5, //Goerli's id
      gas: 5000000, //gas limit
      confirmations: 1, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
