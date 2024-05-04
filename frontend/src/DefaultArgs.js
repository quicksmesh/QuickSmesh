export const GoSpacemeshDefaultArgs = {
  _exec: {
    display: "go-spacemesh",
    info: "Path to go-spacemesh executable",
    value: "./spacemesh/go-spacemesh",
    advanced: true,
  },
  "smeshing-coinbase": {
    display: "Rewards wallet address",
    info: "The address of your wallet where your smeshing reward will be accumulated, this can be found in you Smapp wallet",
    value: "sm1qqqqqq9stxswwxfdmwkq95wjyes6ssw0xlnr6ys2sdpj3",
    advanced: false,
  },
  "data-folder": {
    display: "Node folder",
    info: "Path to your Spacemesh node folder where the node's state database will be stored (note this is different to you PoST data folder)",
    value: "C:/quicksmesh/node-data",
    advanced: false,
  },
  config: {
    display: "Config file",
    info: "Path to your config file. Following go-spacemesh-v1.5.0 this is now optional since all defaults options implement the mainnet config found here: https://configs.spacemesh.network/config.mainnet.json",
    value: "",
    advanced: true,
  },
  "grpc-post-listener": {
    display: "PoST listener address",
    info: "The address:port to listen for PoST services",
    value: "localhost:9094",
    advanced: true,
  },
};

export const ServiceDefaultArgs = {
  _exec: {
    display: "post-service",
    info: "Path to PoST service executable",
    value: "./spacemesh/service",
    advanced: true,
  },
  dir: {
    display: "PoST data folder",
    info: "Path to PoST data folder containing your initialized data, make sure to copy the identity.key file into your node's identities folder",
    value: "C:/quicksmesh/post-data",
    advanced: false,
  },
  threads: {
    display: "Number of threads",
    info: "Number of threads to use while generating proof, this value should be optimized using the profiler",
    value: 4,
    advanced: true,
  },
  nonces: {
    display: "Number of nonces",
    info: "Number of nonces to per pass while generating proof, this value should be optimized using the profiler",
    value: 128,
    advanced: true,
  },
  address: {
    display: "PoST listener address",
    info: "Address to connect to Spacemesh node",
    value: "http://localhost:9094",
    advanced: true,
  },
  "operator-address": {
    display: "Operator address",
    info: "Address to listen on for the operator service",
    value: "127.0.0.1:50051",
    advanced: true,
  },
};
