import React, { useState } from 'react';
import ScrollableDivs from './ScrollableDivs';
import Simple_stock_card from './Simple_stock_card';
import styles from './selectable_menu.module.css';
import PlusButton from './PlusButton';
import StockInput from './Stock_input';
import TransactionCard from './Transaction_card';
import Assets_menu from './Assets_menu';
import Transactions_menu from './Transactions_menu';
import Dividends_menu from './Dividends_menu';

const Selectable_menu = ({ id, HandleNewTransaction, stocks, transactions, Dividends }) => {
  const [selected, setSelected] = useState(0);

  const handleSelect = (index) => {
    setSelected(index);
  };
  //console.log(stocks);

  let content;

  switch (selected) {
    case 0:
      content = <Assets_menu stocks={stocks} HandleNewTransaction={HandleNewTransaction} id={id}/>
      break;
    case 1:
      content = <Transactions_menu  transactions={transactions}/>
      break;
    case 2:
      content = <Dividends_menu dividends={Dividends}/>
      break;
    default:
      content = null;
      break;
  }



  return (
    <div className={styles.card}>
      <div className={styles.menu}>

        {['Assets', 'Transactions', 'Dividends'].map((item, index) => (
          <div className={styles.buttons} id={index == selected ? styles.selected : ""}
            key={index}
            onClick={() => handleSelect(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={styles.content}>
        {content}
      </div>
    </div>
  );
};

export default Selectable_menu;
