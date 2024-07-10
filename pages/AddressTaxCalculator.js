//We are currently using local backend server 
// To access TaxJar, which accesses the local tax rates
import React, { useState } from 'react';
import axios from 'axios';

const AddressTaxCalculator = ({ taxRate, setTaxRate, nftPrice }) => {
  const [zipcode, setZipcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);

  const handleZipcodeChange = (e) => {
    setZipcode(e.target.value);
  };

  const fetchTaxRate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/calculate-tax', {
        customer_details: {
          address: {
            postal_code: zipcode,
            country: 'US', // assuming US for simplicity
          },
        },
      });

      const rate = response.data.taxRate;
      setTaxRate(rate);
      calculateTaxAmount(rate);
    } catch (err) {
      setError('Error fetching tax rate');
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxAmount = (rate) => {
    const tax = nftPrice * (rate / 100);
    setTaxAmount(tax);
  };

  const handleFetchTaxRate = () => {
    if (zipcode) {
      fetchTaxRate();
    } else {
      setError('Please enter a valid zipcode');
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-bold mb-2">Enter Your Zipcode</h3>
      <input 
        type="text"
        value={zipcode}
        onChange={handleZipcodeChange}
        placeholder="Enter your zipcode"
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <button 
        onClick={handleFetchTaxRate} 
        className="common-btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300 mb-4"
      >
        Fetch Tax Rate
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {taxRate && <p>Tax Rate: {taxRate}%</p>}
      {taxAmount > 0 && <p>Tax Amount: ${taxAmount.toFixed(2)}</p>}
    </div>
  );
};

export default AddressTaxCalculator;
