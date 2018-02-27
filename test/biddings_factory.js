var Bidding = artifacts.require("Bidding.sol");
var BiddingsFactory = artifacts.require("BiddingsFactory.sol");

contract('BiddingsFactory', function(accounts) {
  it("should create and return bidding", function(done) {
    BiddingsFactory.deployed().then(async function (biddings_factory) {
      await biddings_factory.create("First", "First bidding", 5, 10);
      var biddings = await biddings_factory.getAllBiddings();
      assert.equal(biddings.length, 1, "There is one bidding.");
      var bidding = await biddings_factory.getLastBidding();
      var firstBiddingOwner = await Bidding.at(bidding).owner.call();
      assert.equal(accounts[0], firstBiddingOwner, "There is one, previously created bidding.");
      done();
    });
  });
});
