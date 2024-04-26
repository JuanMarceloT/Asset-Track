import React from 'react';
import styles from './TransactionCard.module.css';

const TransactionCard = ({ transactions }) => {
    //console.log(transactions);
    
    if(transactions){
        return (
          
          <>
          {transactions.map((transaction, index) => (
            <div className="card">
            <table key={index} className={styles.container}>
                <thead>
                    <tr>
                        <th>Ação</th>
                        <th>Preço</th>
                        <th>Qtd</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{transaction.stock_id}</td>
                        <td>R${transaction.price_in_real}</td>
                        <td>{transaction.units}</td>
                    </tr>
                </tbody>
            </table>
        </div>
          ))}
        </>
          );
    }
};

export default TransactionCard;
