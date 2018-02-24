var BiddingsFactory = artifacts.require("BiddingsFactory.sol");

contract('BiddingsFactory', function(accounts) {
  it("should create and return bidding", function(done) {
    BiddingsFactory.deployed().then(async function (biddings_factory) {
      await biddings_factory.create("First", "First bidding", 5, 10);
      var biddings = await biddings_factory.getAllBiddings();
      assert.equal(biddings.length, 1, "There is one bidding.");
      done();
    });
  });
});
