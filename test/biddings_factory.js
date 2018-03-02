var Bidding = artifacts.require("Bidding.sol");
var BiddingsFactory = artifacts.require("BiddingsFactory.sol");

contract('BiddingsFactory', function(accounts) {
  it("should create and return bidding", function(done) {
    BiddingsFactory.deployed().then(async function (biddings_factory) {
      await biddings_factory.create("First", "First bidding", 5, 10);
      var biddings = await biddings_factory.getAllBiddings.call();
      assert.equal(biddings.length, 1, "There is one bidding.");
      var bidding = await biddings_factory.getLastBidding.call();
      var firstBiddingOwner = await Bidding.at(bidding).owner.call();
      assert.equal(accounts[0], firstBiddingOwner, "There is one, previously created bidding.");
      done();
    });
  });

  it("should create second contract and remove it", function(done) {
    BiddingsFactory.deployed().then(async function (biddings_factory) {
      await biddings_factory.create("Second", "Second bidding", 2, 20, {from: accounts[2]});
      var biddings = await biddings_factory.getAllBiddings();
      assert.equal(biddings.length, 2, "There are two biddings.");
      var biddingAddress = await biddings_factory.getLastBidding.call();
      var bidding = await Bidding.at(biddingAddress);
      setTimeout(async function () {
        await biddings_factory.remove(biddings.length - 1);
        await bidding.bidEnd({from: accounts[2]});
        var biddingsNumber = await biddings_factory.getNumberOfBiddings.call();
        assert.equal(biddingsNumber, 1, "There is only one bidding.");
        done();
      }, 1000 * 2);
    });
  });
});
