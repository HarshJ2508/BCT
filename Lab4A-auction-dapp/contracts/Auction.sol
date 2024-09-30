// SPDX-License-Identifier: MIT 
pragma solidity >=0.5.0 <0.9.0;

contract Auction {
    address internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum auction_state { CANCELLED, STARTED }
    
    struct car { 
        string Brand;
        string Rnumber; // Registration number
    }

    car public Mycar;
    address[] bidders;
    mapping(address => uint) public bids; 
    auction_state public STATE;

    modifier an_ongoing_auction() { 
        require(block.timestamp <= auction_end && STATE == auction_state.STARTED, "Auction is not active");
        _;
    }

    modifier only_owner() { 
        require(msg.sender == auction_owner, "Only auction owner can perform this action");
        _;
    }

    constructor(string memory _brand, string memory _rnumber, uint256 _duration) {
        auction_owner = msg.sender;
        auction_start = block.timestamp;
        auction_end = auction_start + _duration;
        STATE = auction_state.STARTED; 
        Mycar = car(_brand, _rnumber);
    }

    function bid() public payable an_ongoing_auction returns (bool) {
        require(msg.value > highestBid, "Your bid is too low");
        
        if (highestBid != 0) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);

        emit BidEvent(highestBidder, highestBid);
        return true;
    }

    function withdraw() public returns (bool) {
        uint amount = bids[msg.sender];
        require(amount > 0, "No funds to withdraw");

        bids[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function cancel_auction() external only_owner returns (bool) {
        STATE = auction_state.CANCELLED;
        auction_end = block.timestamp;

        emit CanceledEvent("Auction cancelled by owner", block.timestamp);
        return true;
    }

    // Events
    event BidEvent(address indexed highestBidder, uint256 highestBid); 
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}
