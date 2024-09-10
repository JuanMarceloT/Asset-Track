import React, { useState, useEffect } from 'react';
import '../../config.js';// Import the global configuration here
import styles from './simple_stock_card.module.css';
import { get_stock_code_by_id, get_stock_img_by_id, get_stock_name_by_id, get_stock_price_by_id } from '../../bff';


function Simple_stock_card({ stock, stock_prices }) {

  
  const [stockPrice, setStockPrice] = useState(0);
  const [stockVariation, setStockVariation] = useState(0); 

  useEffect(() => {
    if(stock_prices){
      setStockPrice(stock_prices.price);
      setStockVariation(stock_prices.variation);
    }
  }, [stock_prices]);

  return (
    <div className={styles.container}>
      <img src={stock.img_url} alt='logo'></img>
      <div className={styles.infos}>
        <div className={styles.stock_code}>
          <h1>{stock.stock_name}</h1>
          <p>{stock.stock_code}</p>
        </div>
        <div className={styles.stock_price}>
          <h1>R$ {stockPrice.toFixed(2)}</h1>
          <span id={
            stockVariation > 0
              ? styles.positive
              : stockVariation < 0
                ? styles.negative
                : styles.neutral
          }>{stockVariation}%</span>
        </div>

      </div>
    </div>

  );

};

export default Simple_stock_card;
