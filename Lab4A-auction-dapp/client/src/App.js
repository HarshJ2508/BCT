import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import auctionABI from './Auction.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [highestBidder, setHighestBidder] = useState("");
  const [highestBid, setHighestBid] = useState("");

  useEffect(() => {
    // Initialize web3 and connect to Ganache CLI
    async function initWeb3() {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        const userAccounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(userAccounts);
        setSelectedAccount(userAccounts[0]); // Default to first account
        await updateBalance(userAccounts[0]); // Fetch initial balance
        await fetchHighestBidDetails(); // Fetch initial highest bid details
      } catch (error) {
        console.error("Error connecting to Ganache:", error);
      }
    }
    initWeb3();
  }, []);

  // Function to update the balance
  const updateBalance = async (account) => {
    if (web3) {
      const balanceInWei = await web3.eth.getBalance(account);
      const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');
      console.log("d");
      setBalance(balanceInEth);
    }
  };

  // Function to fetch highest bidder and highest bid
  const fetchHighestBidDetails = async () => {
    if (web3) {
      const auctionContract = new web3.eth.Contract(
        auctionABI.abi,
        "0xD4ffB6548AAa664b42CF5f057cc3aD438F2B683f"
      );

      const highestBidder = await auctionContract.methods.highestBidder().call();
      const highestBid = await auctionContract.methods.highestBid().call();

      setHighestBidder(highestBidder);
      setHighestBid(web3.utils.fromWei(highestBid, 'ether'));
    }
  };

  // Handle account change from dropdown
  const handleAccountChange = async (e) => {
    const account = e.target.value;
    setSelectedAccount(account);
    await updateBalance(account); // Update balance when the account changes
  };

  // Place a bid
  const handleBid = async () => {
    try {
      const response = await axios.post("http://localhost:3000/bid", {
        bidderAddress: selectedAccount, // Using the selected account from the dropdown
        bidAmount
      });
      console.log("Bid placed successfully:", response.data);
      await updateBalance(selectedAccount); // Update balance after placing a bid
      await fetchHighestBidDetails(); // Update highest bid and bidder
    } catch (error) {
      if (error.response) {
        console.error("Error placing bid:", error.response.data);
      } else {
        console.error("Error placing bid:", error.message);
      }
    }
  };

  // Withdraw funds
  const handleWithdraw = async () => {
    try {
      const response = await axios.post("http://localhost:3000/withdraw", {
        address: selectedAccount,
      });
      console.log("Withdrawal successful:", response.data);
      await updateBalance(selectedAccount); // Update balance after withdrawal
    } catch (error) {
      if (error.response) {
        console.error("Error withdrawing funds:", error.response.data);
      } else {
        console.error("Error withdrawing funds:", error.message);
      }
    }
  };

  // Cancel the auction (only for owner)
  const handleCancel = async () => {
    try {
      const response = await axios.post("http://localhost:3000/cancel");
      console.log("Auction cancelled:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error cancelling auction:", error.response.data);
      } else {
        console.error("Error cancelling auction:", error.message);
      }
    }
  };


  return (
    <div className="App">
      <h1>Auction DApp</h1>

      <div>
        <h3>Select Account</h3>
        {/* Dropdown for selecting wallet/account */}
        <select value={selectedAccount} onChange={handleAccountChange}>
          {accounts.map((account, index) => (
            <option key={index} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Current Address</h3>
        <p>{selectedAccount}</p>

        <h3>Current Balance</h3>
        <p>{balance} ETH</p>
      </div>

      <div>
        <h3>Place Bid</h3>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount in ETH"
        />
        <button onClick={handleBid}>Place Bid</button>
      </div>

      <div>
        <h3>Highest Bidder</h3>
        <p>Address: {highestBidder}</p>
        <p>Bid Amount: {highestBid} ETH</p>
      </div>

      <div>
        <h3>Withdraw Funds</h3>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>

      <div>
        <h3>Cancel Auction (Owner Only)</h3>
        <button onClick={handleCancel}>Cancel Auction</button>
      </div>
    </div>
  );
}

export default App;
