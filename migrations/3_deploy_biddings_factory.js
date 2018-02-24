var BiddingsFactory = artifacts.require("./BiddingsFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(BiddingsFactory);
};
