import React from 'react';
import style from './Transaction_card.module.css';
import { get_stock_code_by_id, get_stock_img_by_id, get_stock_name_by_id, get_stock_price_by_id } from '../bff';

const TransactionCard = ({ transaction }) => {



  return (
    <tr className={style.card}>
      <img src={get_stock_img_by_id(transaction.stock_id)} alt='logo'></img>
      <td>{get_stock_name_by_id(transaction.stock_id)}</td>
      <td>{transaction.date.split('').slice(0, 10).join('')}</td>
      <td>{transaction.type}</td>
      <td>{transaction.price}</td>
      <td>{transaction.units}</td>
    </tr>
  );
};

export default TransactionCard;

