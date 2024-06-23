import React from 'react';
import styles from './simple_stock_card.module.css';
import { get_stock_code_by_id, get_stock_img_by_id, get_stock_name_by_id, get_stock_price_by_id } from '../bff';


function Simple_stock_card ({stock_id, Avg_price}){

      let stock_price = get_stock_price_by_id(stock_id);
      let stock_variation = (stock_price * 100 / parseFloat(Avg_price)) - 100; 
      stock_variation = parseInt(stock_variation);


        return (
          
            <div className={styles.container}>
              <img src={get_stock_img_by_id(stock_id)} alt='logo'></img>
              <div className={styles.infos}>
                <div className={styles.stock_code}> 
                  <h1>{get_stock_name_by_id(stock_id)}</h1>
                  <p>{get_stock_code_by_id(stock_id)}</p>
                </div>
                <div className={styles.stock_price}>
                  <h1>R$ {stock_price}</h1>
                  <span id={stock_variation > 0 ? styles.positive : styles.negative}>{stock_variation}%</span>
                </div>

              </div>
            </div>
      
          );
    
};

export default Simple_stock_card;
