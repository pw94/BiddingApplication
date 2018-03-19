pragma solidity ^0.4.4;

import './Bidding.sol';

contract BiddingsFactory {
  Bidding[] biddings;
  
  function BiddingsFactory() public {
  }

  function create(string name, string description, uint duration, uint startingBid) public {
    var bidding = new Bidding(name, description, duration, startingBid);
    bidding.changeOwner(msg.sender);
    biddings.push(bidding);
  }

  function getLastBidding() public view returns (Bidding) {
    require(biddings.length > 0);
    return biddings[biddings.length-1];
  }

  function remove(uint index) public {
    if (index >= biddings.length)
      return;
    biddings[index] = biddings[biddings.length-1];
    delete biddings[biddings.length-1];
    biddings.length--;
  }

  function getNumberOfBiddings() public constant returns (uint) {
    return biddings.length;
  }

  function getAllBiddings() public constant returns (Bidding[]) {
    return biddings;
  }

  function getBiddingsByOwner(address owner) public constant returns (Bidding[]) {
    Bidding[] memory ownerBiddings;
    uint8 i = 0;
    for (uint index = 0; index < biddings.length; index++) {
      if (biddings[index].owner() == owner) {
        ownerBiddings[i++] = biddings[index];
      }
    }
    return ownerBiddings;
  }
}
