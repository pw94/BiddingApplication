pragma solidity ^0.4.4;

contract Bidding {
  string name;
  string description;
  uint duration;
  uint startingBid;
  uint createdAt;
  address owner;
  Bidder highestBidder;

  struct Bidder {
    address bidderAddress;
    string name;
    uint value;
    bool eligibleToClaim;
  }

  Bidder[] bidders;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  modifier unexpired {
    require(now < createdAt + duration);
    _;
  }

  modifier expired {
    require(now > createdAt + duration);
    _;
  }

  event HighBidChanged(address indexed _address, bytes _name, uint newHighestBid);
  event BidFailed(address indexed _address, bytes _name, uint bidAmtount);
  
  function Bidding(string _name, string _description, uint _duration, uint _startingBid) public {
    name = _name;
    description = _description;
    duration = _duration;
    startingBid = _startingBid;
    createdAt = now;
    owner = msg.sender;
  }

  function getHighestBid() public constant returns (uint) {
    if (highestBidder.bidderAddress == 0x0) {
      return startingBid;
    } else {
      return highestBidder.value;
    }
  }

  function placeBid(string _name, uint _amount) public payable unexpired {
    bool receivedWei = _amount == msg.value;
    var newBidder = Bidder(msg.sender, _name, _amount, receivedWei);
    if (newBidder.value > getHighestBid()) {
      HighBidChanged(msg.sender, bytes(_name), _amount);
      if (highestBidder.eligibleToClaim) {
        bidders.push(highestBidder);        
      }
      highestBidder = newBidder;
    } else {
      BidFailed(msg.sender, bytes(_name), _amount);
      if (receivedWei) {
        bidders.push(newBidder);                
      }
    }
  }

  function claimBidAmount() public {
    for (uint8 index = 0; index < bidders.length; index++) {
      if (bidders[index].bidderAddress == msg.sender) {
        msg.sender.transfer(bidders[index].value);
        remove(index);
        return;
      }
    }
    revert();
  }

  function remove(uint index) private {
    if (index >= bidders.length)
      return;
    bidders[index] = bidders[bidders.length-1];
    delete bidders[bidders.length-1];
    bidders.length--;
  }

  function bidEnd() public onlyOwner expired {
    selfdestruct(owner);
  }
}
