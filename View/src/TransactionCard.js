import React from 'react';

const TransactionCard = ({ transactions }) => {
    console.log("transaçõse");
    console.log(transactions);
    
    if(transactions){
        return (
            <div>
              {transactions.map((transaction, index) => (
                <div key={index} className="card">
                  <div>Stock ID: {transaction.stockId}</div>
                  <div>Price: {transaction.price}</div>
                  <div>Units: {transaction.units}</div>
                </div>
              ))}
            </div>
          );
    }
};

export default TransactionCard;
