const express = require('express');
const Web3 = require('web3').default;
const dotenv = require('dotenv');
const cors = require('cors');
const auctionABI = require('../build/contracts/Auction.json');
// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the local Ganache network
const web3 = new Web3(process.env.RPC_URL);

// Get contract ABI and address from deployment
const contractABI = auctionABI.abi;

const contractAddress = process.env.CONTRACT_ADDRESS;
const auctionContract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/bid', async (req, res) => {
  try {
    const { bidderAddress, bidAmount } = req.body;
    console.log(bidderAddress, bidAmount);

    const bidInWei = web3.utils.toWei(bidAmount, 'ether');
    const gasPrice = await web3.eth.getGasPrice(); // Fetch the current gas price

    await auctionContract.methods.bid().send({
      from: bidderAddress,
      value: bidInWei,
      gas: 3000000,
      gasPrice // Use legacy gas model
    });

    res.status(200).send({ message: 'Bid placed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error placing bid' });
  }
});



// Withdraw endpoint
app.post('/withdraw', async (req, res) => {
  try {
    const { address } = req.body;

    const gasPrice = await web3.eth.getGasPrice(); // Fetch the current gas price
    await auctionContract.methods.withdraw().send({
      from: address,
      gas: 3000000, // Set gas limit
      gasPrice // Set gas price
    });

    res.status(200).send({ message: 'Funds withdrawn successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error withdrawing funds' });
  }
});


// Cancel auction endpoint (only for the owner)
app.post('/cancel', async (req, res) => {
  try {
    await auctionContract.methods.cancel_auction().send({
      from: process.env.OWNER_ADDRESS, // Auction owner's address
      gas: 3000000
    });

    res.status(200).send({ message: 'Auction cancelled successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error cancelling auction' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
