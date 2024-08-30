import React, { useState } from 'react';
import styles from './Stock_input.module.css';
import { GetUser, Create_New_Transaction, createNewUser, Get_Graph_Params, Get_Dividends, get_ytd_dividends} from './../../bff.js';

function HandleNewTransaction(args) {
    Create_New_Transaction(args);
};


function StockInput({ user_id, setReload }) {
  const [stock_id, setstock_id] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [tipo, settipo] = useState('');

  const handleStockNameChange = (event) => {
    setstock_id(event.target.value);
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
    if (date === " ") {
      console.log("Coloque data");
    } else {

      const type = tipo;
      let year = date.split('-')[0];
      let month = date.split('-')[1];
      let day = date.split('-')[2];



      HandleNewTransaction({
        user_id: parseInt(user_id),
        stock_id: parseInt(stock_id),
        units: parseInt(units),
        price: parseInt(parseFloat(price) * 100), // Convert price to cents
        type,
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
      });

      setReload(true);
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Stock Name:
        <input type="text" value={stock_id} onChange={handleStockNameChange} />
      </label>
      <label>
        Units:
        <input type="number" value={units} min={"0"} onChange={handleUnitsChange} />
      </label>
      <label>
        Price:
        <input type="number" step="0.01" min="0" value={price} onChange={handlePriceChange} />
      </label>
      <label>
        Date:
        <input type="date" value={date} onChange={handleDateChange} />
      </label>
      <div className={styles.types}>
        <button type="submit" onClick={() => settipo('BUY')} id={styles.buy}>Comprar</button>
        <button type="submit" onClick={() => settipo('SELL')} id={styles.sell}>Vender</button>
      </div>
    </form>
  );
}

export default StockInput;
