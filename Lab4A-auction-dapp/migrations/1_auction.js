const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  // Define constructor arguments
  const brand = "Tesla";
  const rnumber = "TS1234";
  const auctionDuration = 60 * 60 * 24; // 1 day in seconds (modify as needed)

  // Deploy the Auction contract with the constructor parameters
  deployer.deploy(Auction, brand, rnumber, auctionDuration);
};
