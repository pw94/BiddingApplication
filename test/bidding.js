var Bidding = artifacts.require("Bidding.sol");

contract('Bidding', function(accounts) {
  const CONTRACT_DURATION = 7;
  const STARTING_BID = 10;
  it("should use starting bid as highest bid when there are not any bids", function(done) {
    Bidding.deployed().then(function(instance) {
      return instance.getHighestBid();
    }).then(function (bid) {
      assert.equal(bid, STARTING_BID, "Default highest bid is equal to starting bid.");
      done();      
    });
  });

  it("should not change highest bid after too low bid", function(done) {
    const FIRST_BID = STARTING_BID - 1;
    var bidding;
    Bidding.deployed().then(function(instance) {
      bidding = instance;
      return bidding.placeBid("First bid", FIRST_BID, {from: accounts[2]});
    }).then(function () {
      return bidding.getHighestBid();
    }).then(function (bid) {
      assert.equal(bid, STARTING_BID, "Highest bid is equal to previous bid.");
      done();      
    });
  });

  it("should get highest bid after first bid", function(done) {
    const FIRST_BID = STARTING_BID + 1;
    var bidding;
    Bidding.deployed().then(function(instance) {
      bidding = instance;
      return bidding.placeBid("First bid", FIRST_BID, {from: accounts[2], value: FIRST_BID});
    }).then(function () {
      return bidding.getHighestBid();
    }).then(function (bid) {
      assert.equal(bid, FIRST_BID, "Highest bid is equal to first bid.");
      done();
    });
  });

  it("should get bid amount back", function(done) {
    const BID = STARTING_BID + 2;
    var bidding;
    Bidding.deployed().then(function(instance) {
      bidding = instance;
      return bidding.placeBid("Second bid", BID, {from: accounts[1], value: BID});
    }).then(function () {
      return bidding.claimBidAmount({from: accounts[2]});
    }).then(function () {
      assert.isTrue(true, "Bid amount returned successfully.");
      done();
    });
  });

  it("should not allowed to end bid before the expiration", function(done) {
    Bidding.deployed().then(async function (instance) {
      var revertFound;
      try {
        await instance.bidEnd();
      } catch (error) {
        revertFound = error.message.search("revert") >= 0;
      } finally {
        assert(revertFound, "Expected revert");
        done();
      }
    });
  });

  it("should not allowed to end bid by ordinary user", function(done) {
    var bidding;
    Bidding.deployed().then(function (instance) {
      bidding = instance;
      setTimeout(async function () {
        var revertFound;
        try {
          await bidding.bidEnd({from: accounts[2]});
        } catch (error) {
          revertFound = error.message.search("revert") >= 0;
        } finally {
          assert(revertFound, "Expected revert");
          done();
        }
      }, 1000 * CONTRACT_DURATION);
    });
  });
});
