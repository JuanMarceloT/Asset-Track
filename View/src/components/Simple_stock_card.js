import React from 'react';
import styles from './simple_stock_card.module.css';
import { get_stock_code_by_id, get_stock_name_by_id } from '../bff';


function Simple_stock_card ({stock_id}){


        return (
          
            <div className={styles.container}>
              <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png' alt='logo'></img>
              <div className={styles.infos}>
                <div className={styles.stock_code}> 
                  <h1>{get_stock_name_by_id(stock_id)}</h1>
                  <p>{get_stock_code_by_id(stock_id)}</p>
                </div>
                <div className={styles.stock_price}>
                  <h1>$102.25</h1>
                  <span id={styles.positive}>+0.32</span>
                </div>

              </div>
            </div>
      
          );
    
};

export default Simple_stock_card;
