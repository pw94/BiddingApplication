var Bidding = artifacts.require("./Bidding.sol");

module.exports = function(deployer) {
  deployer.deploy(Bidding, "Test", "Test description", 100, 10);
};
