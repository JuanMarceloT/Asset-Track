import React from 'react';
import styles from './StockCard.module.css'; 

const StocksCard = ({ stocks }) => {
    
    if(stocks){
        return (
            <div className={styles.container}>
              {stocks.map((Stock, index) => (
                <div key={index} className={styles.card}>
                  <div>Stock ID: {Stock.stock_id}</div>
                  <div>Preço médio: R${Stock.avg_price_in_real}</div>
                  <div>Qtd: {Stock.units}</div>
                </div>
              ))}
            </div>
          );
    }
};

export default StocksCard;
