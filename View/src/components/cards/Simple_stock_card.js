import React, { useState } from 'react';
import styles from './simple_stock_card.module.css';
import { get_stock_code_by_id, get_stock_img_by_id, get_stock_name_by_id, get_stock_price_by_id } from '../../bff';


function Simple_stock_card({ stock }) {

  let stock_variation = 0;
  let price = 0.0;

  return (
    <div className={styles.container}>
      <img src={stock.img_url} alt='logo'></img>
      <div className={styles.infos}>
        <div className={styles.stock_code}>
          <h1>{stock.stock_name}</h1>
          <p>{stock.stock_code}</p>
        </div>
        <div className={styles.stock_price}>
          <h1>R$ {price.toFixed(2)}</h1>
          <span id={
            stock_variation > 0
              ? styles.positive
              : stock_variation < 0
                ? styles.negative
                : styles.neutral
          }>{stock_variation}%</span>
        </div>

      </div>
    </div>

  );

};

export default Simple_stock_card;
