const axios = require('axios');

const url = 'https://deep-index.moralis.io/api/v2.2/nft/0x524cab2ec69124574082676e6f654a18df49a048/7603';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE';

const fetchNFT = async () => {
  try {
    const response = await axios.post(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching NFT data:', error);
  }
};

fetchNFT();
