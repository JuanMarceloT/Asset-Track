import React, { useState } from 'react';
import ScrollableDivs from './ScrollableDivs';
import Simple_stock_card from './Simple_stock_card';
import styles from './selectable_menu.module.css';
import PlusButton from './PlusButton';
import StockInput from './Stock_input';

const Selectable_menu = ({id, HandleNewTransaction, stocks}) => {
  const [selected, setSelected] = useState(0);
  const [IsTabMenu, setIsTabMenu] = useState(1);

  const handleSelect = (index) => {
    setSelected(index);
    setIsTabMenu(1);
  };

  let content;

  switch (selected) {
    case 0:
      content = (<div className={styles.assetMenu}>
        <ScrollableDivs>
        {
          stocks && stocks.map((stock) => (
            <Simple_stock_card stock_id={stock.stock_id}/>
          ))
        }
        </ScrollableDivs>
        <div className={styles.button}>
          <PlusButton state={IsTabMenu} setState={setIsTabMenu} />
        </div>
      </div>)
      break;
    case 1:
      content = (
        <div >
          <h1>urro</h1>
        </div>);
      break;
    default:
      content = null;
      break;
  }

  if (!IsTabMenu && selected == 0) {
    content = (<div className={styles.stockinput}>
      <button className={styles.closeButton} onClick={() => {
        setIsTabMenu(!IsTabMenu);
      }}>X</button>
      <StockInput user_id={id} HandleNewTransaction={HandleNewTransaction}/>
    </div>
    );
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
