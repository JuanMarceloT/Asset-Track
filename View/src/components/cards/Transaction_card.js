import React from 'react';
import '../../config.js';// Import the global configuration here
import style from './Transaction_card.module.css';
import { get_stock_code_by_id, get_stock_img_by_id, get_stock_name_by_id, get_stock_price_by_id } from '../../bff';

const TransactionCard = ({ transaction }) => {

  let date = new Date(transaction.date);
  
  return (
    <tr className={style.card}>
      <td>
        <img src={transaction.img} alt='logo'></img>
      </td>
      <td>{transaction.stock_name}</td>
      <td>{`${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()).padStart(2, '0')}/${date.getFullYear()}`}</td>
      <td>{transaction.type}</td>
      <td>{transaction.price}</td>
      <td>{transaction.units}</td>
    </tr>
  );
};

export default TransactionCard;

