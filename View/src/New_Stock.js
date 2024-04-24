import React, { useState } from 'react';

function StockInput() {
  const [stockName, setStockName] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const handleStockNameChange = (event) => {
    setStockName(event.target.value);
  };

  const handleUnitsChange = (event) => {
    setUnits(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://your-api-url.com/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockName,
          units,
          price,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save stock information');
      }

      // Reset the form fields after successful submission
      setStockName('');
      setUnits('');
      setPrice('');
      setDate('');

      // Optionally, you can handle the response here
      const data = await response.json();
      console.log('Stock information saved:', data);
    } catch (error) {
      console.error('Error saving stock information:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Stock Name:
        <input type="text" value={stockName} onChange={handleStockNameChange} />
      </label>
      <label>
        Units:
        <input type="number" value={units} onChange={handleUnitsChange} />
      </label>
      <label>
        Price:
        <input type="number" value={price} onChange={handlePriceChange} />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={handleDateChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StockInput;
