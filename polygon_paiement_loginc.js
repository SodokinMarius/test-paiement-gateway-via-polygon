const axios = require('axios');
const { ethers } = require('ethers');


// Configuration de l'API
const API_KEY ='JVI1EdSqy_POsYnpFfHUvwaRMbLp4IPC' // This API key was generated on polygon plateform, it will be used to intract with this blockchain 

const API_BASE_URL = 'https://api.polygon.io/v1'; //  this link is to verify  and correct


// function to create a new transaction
async function createTransaction(toAddress, value) {
  // check if wallet is selected and connected successfully
  if (!window.ethereum) {
    throw new Error('Metamask is not installed or not connected.');
  }


  // Asking user to select the wallet from whiw=ch he will pay
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const fromAddress = accounts[0];


  // Create a transaction
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther(value),
  };
  const gasPrice = await provider.getGasPrice();
  const estimatedGas = await signer.estimateGas(transaction);
  const gasLimit = parseInt(estimatedGas.mul(1.2).toString());
  const nonce = await signer.getTransactionCount();


  const signedTransaction = await signer.signTransaction({
    ...transaction,
    gasPrice: gasPrice.toString(),
    gasLimit: gasLimit.toString(),
    nonce: nonce,
  });


  // Send the transaction in polygon blockchain
  const response = await axios.post(`${API_BASE_URL}/transactions`, {
    tx: signedTransaction,
  }, {
    params: {
      api_key: API_KEY
    }
  });


  return response.data;
}


// Simple usecase 
createTransaction('0xabc...', '0.1')
  .then((response) => {
    console.log('Transaction created:', response);
  })
  .catch((error) => {
    console.error('Error creating transaction:', error);
  });
