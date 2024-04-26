import React from 'react';

const TransactionCard = ({ transactions }) => {
    console.log(transactions);
    
    if(transactions){
        return (
            <div>
              {transactions.map((transaction, index) => (
                <div key={index} className="card">
                  <div>Stock ID: {transaction.stock_id}</div>
                  <div>Preço: R${transaction.price_in_real}</div>
                  <div>Qtd: {transaction.units}</div>
                </div>
              ))}
            </div>
          );
    }
};

export default TransactionCard;
