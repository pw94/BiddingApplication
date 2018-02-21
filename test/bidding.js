var Bidding = artifacts.require("Bidding.sol");

contract('Bidding', function(accounts) {
  it("should use starting bid as highest bid when there are not any bids", function(done) {
    Bidding.deployed().then(function(instance) {
      return instance.getHighestBid();
    }).then(function (bid) {
      assert.equal(bid, 10, "Default highest bid is not equal to starting bid.");
      done();      
    });
  });

  it("should get highest bid after first bid", function(done) {
    var bidding;
    Bidding.deployed().then(function(instance) {
      bidding = instance;
      return bidding.placeBid("First bid", 20, {from: accounts[2]});
    }).then(function () {
      return bidding.getHighestBid();
    }).then(function (bid) {
      assert.equal(bid, 20, "Highest bid is equal to first bid.");
      done();      
    });
  });
});
