require("@babel/register");
require("core-js/stable");
require("regenerator-runtime/runtime");

module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",
        port: 7545, 
        network_id: "*", 
      },
    },
    contracts_directory: './app/contracts',
    contracts_build_directory:'./app/truffle_abis',
    compilers: {
        solc: {
            version: "0.8.0",
            optimizer: {
                enabled: true,
                runs: 200
            },
        },
    },
};